export default function Post({title, summary, cover, content, createdAt }){
    return(
        <div className = "post">
          <div className= "image">
          <img src= "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=945,h=922,fit=crop/Yan2Gge3KLipZLJp/limewire-ai-studio-asset-12--min-YZ97QWLagvT2ozQq.jpeg" alt= ""/>
          </div>
          <div className= "texts">
          <h2>{title}</h2>
          <p className = "info">
            <a className = "author">Kapil Bhatt</a>
            <time>{createdAt}</time>
          </p>
          <p className = "summary">{summary}</p>
          </div>
        </div>

    )
}