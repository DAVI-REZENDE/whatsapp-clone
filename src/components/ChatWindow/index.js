import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

import './styles.css';
import MessageItem from '../MessageItem';
import Api from '../../Api';

function ChatWindow({user, data}) {

  let record = null;
  let Speechrecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(Speechrecognition != undefined){
    record = new Speechrecognition();
  }

  const [emojiOpen, setEmojiOpen] = useState(false)
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [list, setList] = useState([])
  const [users, setUsers] = useState([])

  const body = useRef();

  useEffect(()=>{
    setList([])
    let unsub = Api.onChatContent(data.chatId, setList, setUsers)
    return unsub
  }, [data.chatId])

  useEffect(()=>{
    if(body.current.scrollHeight > body.current.offsetHeight){
      body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight
    }
  }, [list])

  const handlEmojiClick = (e, emojiObject) => {
    setText( text + emojiObject.emoji)
  }

  const handleEmojiClick = () => {
    setEmojiOpen(true)
  }

  const handleCloseEmoji = () => {
    setEmojiOpen(false)
  }

  const handleSendClick = () => {
    if(text != ''){
      Api.sendMessage(data, user.id, 'text', text, users)
      setText('')
      setEmojiOpen(false)
    }
  }

  const handleKeyUp = (e) => {
    if(e.keyCode === 13){
      handleSendClick()
    }
  }

  const handleMicClick = () => {
    if(record !== null){
      record.onstart = () => {
        setListening(true)
      }
      record.onend = () => {
        setListening(false)
      }
      record.onresult = (e) => {
        setText(e.results[0][0].transcript)
      }

      record.start()

    }
  }

  return(
      <div className="chatWindow">

        <div className="chatWindow--header">
          
          <div className="chatWindow--headerinfo">
            <img className="chatWindow--avatar" src={data.image} alt=""/>
            <div className="chatWindow--name">{data.title}</div>
          </div>

          <div className="chatWindow--headerbuttons">
            <div className="chatWindow--btn">
              <SearchIcon style={{color: '#919191'}} />
            </div>
            <div className="chatWindow--btn">
              <AttachFileIcon style={{color: '#919191'}} />
            </div>
            <div className="chatWindow--btn">
              <MoreVertIcon style={{color: '#919191'}} />
            </div>
          </div>

        </div>

        <div ref={body} className="chatWindow--body">
          {list.map((item, key) => (
            <MessageItem 
              key={key}
              data={item}
              user={user}
            />
          ))}
        </div>

        <div 
          className="chatWindow--emojiarea"
          style={{height: emojiOpen ? '300px' : '0px' }}
        >

          <EmojiPicker
            disableSearchBar
            disableSkinTonePicker
            onEmojiClick={handlEmojiClick}
          />

        </div>

        <div className="chatWindow--footer">
          
          <div className="chatWindow--pre">

            <div 
              className="chatWindow--btn"
              onClick={handleCloseEmoji}
              style={{width: emojiOpen ? '40px' : '0px'}}
            >
              <CloseIcon style={{color: '#919191'}} />
            </div>

            <div 
              className="chatWindow--btn" 
              onClick={handleEmojiClick}
            >
              <InsertEmoticonIcon 
                style={{color: emojiOpen ? '#009688' : '#919191'}} 
              />
            </div>

          </div>

          <div className="chatWindow--inputarea">

            <input 
              type="text" 
              placeholder="Digite uma mensagem" 
              className="chatWindow--input" 
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyUp={handleKeyUp}
            />

          </div>

          <div className="chatWindow--pos">
            
            {text === '' && 
              <div onClick={handleMicClick} className="chatWindow--btn">
                <MicIcon style={{color: listening ? '#126ece' : '#919191'}} />
              </div>
            }

            {text !== '' &&
              <div onClick={handleSendClick} className="chatWindow--btn">
                <SendIcon style={{color: '#919191'}} />
              </div>
            }
            
            

          </div>

        </div>
  

      </div>
  );
}
 
export default ChatWindow;