import React, { useCallback } from 'react';
import {Container,Header} from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IDM, IUser } from '@typings/db';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';

const  DirectMessage=()=>{
    const {workspace,id}=useParams<{workspace:string;id:string}>();
    const {data:userData}=useSWR(`/api/woorkspaces/${workspace}/users/${id}`,fetcher);
    const {data:myData}=useSWR(`/api/users`,fetcher);
    const [chat,onChangeChat,setChat]= useInput('');
    const {data:chatData,mutate:mutateChat,revalidate}=useSWR<IDM[]>(
        `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,fetcher,
    );


    const onSubmitForm=useCallback((e)=>{
        e.preventDefault();
        console.log(chat);
        if(chat?.trim()){
            axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
                content:chat,
            })
            .then(()=>{
                revalidate();
                setChat('');
            })
            .catch(console.error);
    }},[chat])
    if(!userData||!myData){
        return null;
    }

    return(
            <Container>
                <Header>
                    <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
                    <span>{userData.nickname}</span>
                </Header>
                <ChatList chatData={chatData}/>
                <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} setChat={setChat}/>
            </Container>
    );
}

export default DirectMessage;