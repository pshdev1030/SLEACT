import Chat from '@components/Chat';
import { ChatZone, Section} from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { useCallback, useRef, VFC } from 'react';
import Scrollbars from 'react-custom-scrollbars';

interface Props{
  chatData?:IDM[];
}

const ChatList:VFC<Props> =({chatData}) => {
  const scrollbarRef=useRef(null);
  const onScroll=useCallback(()=>{

  },[])
  console.log(typeof chatData,chatData);
  return (
    <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
    <ChatZone>
        {chatData?.map((chat)=>(
          <Chat key={chat.id} data={chat}/>
        ))}
    </ChatZone>
    </Scrollbars>
  );
};

export default ChatList;