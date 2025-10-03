import { whispersData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


document.addEventListener('click', function(e){
    // console.log(e.target.dataset.reply)
    // console.log(e.target.dataset.rewhisper)

    handleLikeClick(e.target.dataset.like)
    render()
})

function handleLikeClick(uuid){
    whispersData.forEach(function(whisper){



        if(whisper.uuid === uuid){
            
            whisper.likes++
        }

    })
}


function getFeed(){

    let feedHtml = ''

    whispersData.forEach(function(whisper){

        let repliesHtml = ''

        if(whisper.replies.length > 0){
            whisper.replies.forEach(function(reply){
            repliesHtml += `<div class="whisper-reply">
                            <div class="whisper-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="whisper-text">${reply.whisperText}</p>
                                </div>
                            </div>
                            </div>`
            })
        }
        

        feedHtml += `<div class="whisper">
                        <div class="whisper-inner">
                            <img src="${whisper.profilePic}" class="profile-pic">
                            <div class="inner-container">
                                <p class="handle">${whisper.handle}</p>
                                <p class="whisper-text">${whisper.whisperText}</p>
                                <div class="whisper-details">

                                    <span class="whisper-detail">
                                        <i class="fa-regular fa-comment-dots" data-reply="${whisper.uuid}"></i>
                                        ${whisper.replies.length}
                                    </span>

                                    <span class="whisper-detail">
                                        <i class="fa-solid fa-heart" data-like="${whisper.uuid}"></i>
                                        ${whisper.likes}
                                    </span>

                                    <span class="whisper-detail">
                                        <i class="fa-solid fa-retweet data-rewhisper="${whisper.uuid}"></i>
                                        ${whisper.rewhispers}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="hidden" id="reply-${whisper.uuid}">
                            <!-- Reply goes here! -->         
                            ${repliesHtml}
                        </div>
                    </div>`
    })

    return feedHtml
}


function render(){
    document.getElementById('feed').innerHTML = getFeed()
}


render()