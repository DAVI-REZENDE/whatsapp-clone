import React, { useState, useEffect } from 'react';

import './style.css';

function ChatListItem({onClick, active, data}) {

  const [time, setTime] = useState('')

  useEffect(()=>{
    if(data.lastMessageDate > 0){
      let d = new Date(data.lastMessageDate.seconds * 1000)
      let hours = d.getHours()
      let minutes = d.getMinutes()
      hours = hours < 10 ? '0'+hours : hours;
      minutes = minutes < 10 ? '0'+minutes : minutes;
      setTime(`${hours}:${minutes}`)
    }
  }, [data])

  return(
      <div 
        className={`chatlistItem ${active?'active':''}`}
        onClick={onClick}
      >
          <img className="chatlistItem--avatar" src={data.image} alt="" />
          <div className="chatlistItem--lines">

            <div className="chatlistItem--line">
                <div className="chatlistItem--name">{data.title}</div>
                <div className="chatlistItem--date">{time}</div>
            </div>

            <div className="chatlistItem--line">
                <div className="chatlistItem--lastMsg">
                    <p>
                    {data.lastMessage}
                    </p>
                </div>
            </div>

          </div>
      </div>
  );
}

export default ChatListItem;