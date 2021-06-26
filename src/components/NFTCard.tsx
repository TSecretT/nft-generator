import React from 'react';

export const NFTCard = ({ data }: any) => {
    const [hovered, setHovered] = React.useState<boolean>(false);

    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={`container nft-card ${hovered? "slide-top" : "slide-bottom"}`}>
            <img src={data.url} alt="nft" className="nft-card-image" />
            <>
            <span className="nft-card-name">{data.name}</span>
            <span className="nft-card-price">{data.price}</span>
            </>
        </div>
    )
}

export default NFTCard