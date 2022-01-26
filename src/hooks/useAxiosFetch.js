import axios from "axios";
import { useEffect, useState } from "react"

const useAxiosFetch = (dataUrl) => {

    const [data, SetData] = useState([]);
    const [fetchError, SetFetchError] = useState(null);
    const [isLoading, SetIsLoading] = useState(false);

    useEffect(() => {

        let isMounted = true;
        const source = axios.CancelToken.source();

        const fetchData = async (url) => {
            SetIsLoading(true);

            try {
                const resp = await axios.get(url, { cancelToken: source.token });

                if (isMounted) {
                    SetData(resp.data);
                    SetFetchError(null);
                }
            } catch (error) {
                if (isMounted) {
                    SetFetchError(error.message);
                    SetData([]);
                }
            } finally {
                isMounted && SetIsLoading(false);
            }

        };

        fetchData(dataUrl);

        //cleanup
        return () => {
            isMounted = false;
            source.cancel();
        };
    }, [dataUrl]);

    return { data, fetchError, isLoading };
}

export default useAxiosFetch;