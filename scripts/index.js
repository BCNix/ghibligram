import { whispersData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


// console.log(uuidv4())


// whispersData.forEach(function(whisper){
//     console.log(whisper.handle)
// })

// Display each whisper on the screen
// Display reply when clicking the message icon




document.addEventListener('click', function(e){
    console.log(e.target.dataset.reply)
    console.log(e.target.dataset.like)
    console.log(e.target.dataset.rewhisper)
})


function getFeed(){
    let feedHtml = ''

    whispersData.forEach(function(whisper){
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
                        <div class="" id="reply-">
                            <!-- Reply goes here! -->
                        </div>
                    </div>`
    })

    return feedHtml
}


function render(){
    document.getElementById('feed').innerHTML = getFeed()
}


render()




