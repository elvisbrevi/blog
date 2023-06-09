import './post.css';
import { useEffect, useState } from 'preact/hooks';

interface Post {
    title: string;
    slug: string;
    cuid: string;
    coverImage: string;
    content: string;
    contentMarkdown: string;
    dateAdded: string;
}

const Post = () => {
    
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {

        async function fetchDataAsync() {
            const postData = await fetchData();
            setPost(postData);
        }

        fetchDataAsync();
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div class="post-content">
            <span class="post-date">{post.dateAdded.substring(0, 10)}</span>
            <h1 class="post-title">{post.title}</h1>
            <img class="post-featured-image" width={500} src={post.coverImage} />
            <div class="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
};

async function fetchData(): Promise<Post> {

    let slug : string | null = window.location.pathname.split("/").slice(-1)[0] || null;

    const query = `
        {
            post(slug:"${slug}", hostname:"elvisbrevi.hashnode.dev") {
                title,
                slug,
                cuid,
                coverImage,
                content,
                contentMarkdown,
                dateAdded
            }
        }
    `;
  
    const response = await fetch("https://api.hashnode.com", {
        method: "post",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });

    const { data } = await response.json();
    return data.post;
}

export default Post;
