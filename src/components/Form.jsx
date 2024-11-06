import { useEffect, useState } from "react"
import { postData, updatePost } from "../api/PostApi";

export const Form = ({data, setData, updateDataApi, setUpdateDataApi}) => {
    const [addData, setAddData] = useState({
        title: "",
        body: "",
    });

    let isEmpty = Object.keys(updateDataApi).length === 0;

    // get update data from api and show it in input field
    useEffect(() => {
        updateDataApi && setAddData({
            title: updateDataApi.title || "",
            body: updateDataApi.body || "",
        })
    }, [updateDataApi])

    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setAddData((prev) => {
            //console.log(prev);
            return {
                ...prev,
                [name]: value,
            }
        });
    }

    const addPostData = async () => {
        const res = await postData(addData);
        //console.log("res",res);
        
        if(res.status === 201)
        {
            setData([...data, res.data]);
            setAddData({ title: "", body: "" });
        }
    }

    // Update data in api
    const updatePostData = async () => {
        try {
            const res = await updatePost(updateDataApi.id, addData);
            //console.log(res);
            if(res.status === 200)
            {
                setData((prev) => {
                    return prev.map((curEle) => {
                        return curEle.id === res.data.id ? res.data : curEle;
                    });
                });
                setAddData({ title: "", body: "" });
                setUpdateDataApi({});
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    // Form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.value;
        if(action === 'Add')
        {
            addPostData();
        }
        else if(action === 'Edit')
        {
            updatePostData();
        }
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <label htmlFor="title"></label>
                <input type="text" name="title" id="title" autoComplete="off" placeholder="Add Ttitle" value={addData.title} onChange={handleInputChange} />
            </div>

            <div>
                <label htmlFor="body"></label>
                <input type="text" name="body" id="body" autoComplete="off" placeholder="Add Post" value={addData.body} onChange={handleInputChange} />
            </div>

            <button type="submit" value={isEmpty ? 'Add' : 'Edit'}> {isEmpty ? 'Add' : 'Edit'}</button>
        </form>
    )
}