'use client';
import React from 'react';
import Image from 'next/image';


interface StarRatingProps {
    starNum?: number
}

const getStarSvg = (index: number, rating: number) => {
    if (index >= rating) {
        return '/empty-star.svg';
    }
    else if (rating - index === 0.5) {
        return '/half-star.svg';
    }
    else {
        return '/star.svg'
    }
}

const StarRating = ({
    starNum = 5
}) => {
    const [rating, setRating] = React.useState<number>(0);
    const [hoverRating, setHoverRating] = React.useState<number>(0);
    const [isHovering, setIsHovering] = React.useState<boolean>(false);

    const onHover = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
        setIsHovering(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        if (x <= (rect.width / 2)) {
            setHoverRating(i + 0.5)
        }
        else {
            setHoverRating(i + 1);
        }
    }

    const onMouseLeave = () => {
        setIsHovering(false);
        setHoverRating(rating);
    }

    const onClick = () => {
        setRating(hoverRating);
    }

    return (
        <div className='flex'>
            {[1, 2, 3, 4, 5].map((_, i) => {
                const ratingToLookAt = isHovering ? hoverRating : rating;
                
                return (
                    <div className={`cursor-pointer ${i < starNum - 1 ? "pr-2" : ""}`} key={i} onMouseMove={e => { onHover(e, i) }} onClick={onClick} onMouseLeave={onMouseLeave}>
                        <Image
                            className="w-full h-full"
                            src={getStarSvg(i, ratingToLookAt)}
                            alt={"star"}
                            width={0}
                            height={0}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default StarRating