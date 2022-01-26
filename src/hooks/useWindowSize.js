import { useState, useEffect } from "react";

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(()=>{
        const handleResize=()=>{
            
            setWindowSize({
                width:window.innerWidth,
                height:window.innerHeight,
            });
        }
        handleResize();
        window.addEventListener('resize',handleResize);

        // the return at the end of a useEffect func is the clean up
        return ()=>{ 
            console.log("🚀runs if a useEffect dep changes");
            window.removeEventListener('resize',handleResize);
            
        };
    },[]);

    return windowSize;
}

export default useWindowSize;