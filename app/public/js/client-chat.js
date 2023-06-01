//yeu cau ket noi voi server
        const socket = io()
      //nhan du lieu tu server gui den
    //   socket.on('send messges from server to client',(messges)=>{
    //     console.log('Da nhan duoc tu phia server:\n'+messges)
    //   })

    //   document.getElementById('btn-increment').addEventListener('click',() =>{
    //         socket.emit('send increment from client to server')
    //   })
    //   socket.on("send count from client to server",(count)=>{
    //     document.getElementById("value-count").innerHTML =count
    //   })

    document.getElementById("form-messages").addEventListener('submit', (e) =>{
        e.preventDefault();
        const messgesText = document.getElementById("input-messages").value
        const acknowledgements = (error) =>{
            if(error){
                return alert("Tin nhắn không phù hợp")
            }
            console.log('Gửi thành công')
        }
        socket.emit('send messges form client to server', messgesText,acknowledgements)
    })


    socket.on("send messges form server to client",(messages) =>{
        console.log(messages)
        const {messgesText , createAt,username} = messages;
        const htmlContent =  document.getElementById("app__messages").innerHTML
        let messageEle = `<div class="message-item">
        <div class="message__row1">
          <p class="message__name">${username}</p>
          <p class="message__date">${createAt}</p>
        </div>
        <div class="message__row2">
          <p class="message__content">
            ${messgesText}
          </p>
        </div>
      </div>`
      let messContent = htmlContent + messageEle
      document.getElementById("app__messages").innerHTML = messContent
      //xoa tin nhan da gui trong  input
      document.getElementById("input-messages").value =""
    })

    socket.on("send client disconnected from server to client",(messages) =>{
        console.log(messages)
    })


    document.getElementById("btn-share-location").addEventListener('click', (e) =>{
        e.preventDefault();
        if(!navigator.geolocation){
            return alert("Trình duyệt không hỗ trợ chia sẻ vị trí")
        }
        navigator.geolocation.getCurrentPosition((position)=>{
        const {latitude, longitude} = position.coords
        socket.emit('send position from client to server',{latitude, longitude})
    })
    })


    socket.on("send position from server to client",(data) =>{
      const {messgesText , createAt,username} = data;
      const htmlContent =  document.getElementById("app__messages").innerHTML
      let messageEle = `<div class="message-item">
      <div class="message__row1">
        <p class="message__name">${username}</p>
        <p class="message__date">${createAt}</p>
      </div>
      <div class="message__row2">
        <p class="message__content">
          <a href="${messgesText}" target="_blank">Vị trí của user ${username} </a>
        </p>
      </div>
    </div>`
    let messContent = htmlContent + messageEle
    document.getElementById("app__messages").innerHTML = messContent
    })


    const queryString = location.search;
    const params = Qs.parse(queryString,{
        ignoreQueryPrefix: true
    })
    const {room ,username} = params
   socket.emit('join room from client to server',({room,username}))
    document.getElementById("app__title").innerHTML = room

       //xử lý userList
   socket.on("send userList from server to client",(userList)=>{
    console.log(userList)
    let contentHTML= ''
    userList.map((user) =>{
        contentHTML += `<li class="app__item-user">${user.username}</li>`
    })
    document.getElementById("app__list-user--content").innerHTML = contentHTML
   })
   


