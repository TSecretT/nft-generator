import React from 'react';

import { Upload, Input, Button } from 'antd';
import firebase from '../firebase';
import { Header, LoadingModal, NFTGenerationResult } from '../components';
import { nanoid } from 'nanoid'
import utils from '../utils';
import Lemon_nft from '../contracts/lemon_nft'

export const GenerateNFT = () => {

    const [generating, setGenerating] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>();
    const [imageURL, setImageURL] = React.useState<string>();
    const [info, setInfo] = React.useState<any>();
    const [generated, setGenerated] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<any>();
    
  const Contract = new Lemon_nft('0x98a682fE1B3967eFe70834dABf1E67527a993F5C');

    const onUpload = async (options: any) => {
        setUploading(true);
        const { onSuccess, onError, file } = options;
        try {
            const imageID: string = nanoid();
            await firebase.uploadImage(file, imageID)
            .then((imageURL: string) => { setImageURL(imageURL); setImageID(imageID) })
            
            onSuccess(file);
        } catch (err) {
            onError(err)
        }
        setUploading(false);
    };
    

    const beforeUpload = (file:any) => {
        setFile(file);
        utils.getBase64(file, (imageURL: any) => {
            setImageURL(imageURL)
        })
        return false
    }

    const onTextChange = (event: any) => {
        let {name, value} = event.target;
        if (['price', 'amount'].includes(name)) value = parseInt(value);
        setInfo({ ...info, [name]: value || null })
    }

    const onGenerate = async () => {
        if(!file || !info || !localStorage.wallet || !imageURL) return setError("Error occured, please reload the page");

        setGenerating(true);

        const imageID: string = nanoid();
        const url: string = await firebase.uploadImage(file, imageID)
        .then((imageURL: string) => imageURL);

        await firebase.addDocument("NFTs", { ...info, url: url, owner: localStorage.wallet })
        .then((res: any) => { setGenerating(false); setGenerated(true) })
        .catch((error: any) => { console.log(error); setGenerating(false) })
    }

     const MINTING = async () => {
        Contract.mint('test.html//png.kz', localStorage.wallet, 2, ()=>{console.log("ok")});
    }
    
    const renderer = () => {
        if(generated){
            return <NFTGenerationResult status="success" url={imageURL} />
        } else if(generating){
            return <LoadingModal text="Generating NFT..." />
        } else {
            return <>
                <span className="header">Create your own NFT</span>
                {error && <span className="error">{error}</span>}

                <div className="container">
                    <Upload
                        className="upload"
                        disabled={generating}
                        listType="picture-card"
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                    >
                        {imageURL? <img src={imageURL} alt="nft" style={{ width: '100%' }} /> : <span>Upload NFT</span> }
                    </Upload>


                    <Input name="name" onChange={onTextChange} placeholder="NFT name" className="input" />
                    <Input.TextArea name="description" onChange={onTextChange} placeholder="Description" className="input" />

                    <div className="row inputs">
                        <Input name="amount" onChange={onTextChange} placeholder="Amount" className="input input-short" />
                        <Input name="price" onChange={onTextChange} placeholder="Price" className="input input-short" />  
                    </div>

                    <Button onClick={onGenerate} disabled={!(info && info.name && info.description && info.amount && info.price)} className="button button-generate">Generate</Button>
                    <Button onClick={MINTING}  className="button button-generate">Minting</Button>
                </div>
            </>
        }
    }

    return (
        <div className="page">
            <Header />
            {renderer()}
        </div>
    )
}

export default GenerateNFT;