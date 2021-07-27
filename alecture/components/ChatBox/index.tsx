import React, { useCallback, useEffect, useRef, VFC } from "react";
import { ChatArea, MentionsTextarea,Toolbox,SendButton,Form, EachMention } from "./styles";
import autosize from 'autosize';
import { Mention, SuggestionDataItem } from "react-mentions";
import useSWR from "swr";
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import gravatar from 'gravatar';
import regexifyString from 'regexify-string';

interface Props{
    chat:string;
    onSubmitForm:(e:any)=>void;
    onChangeChat:(e:any)=>void;
    setChat:(e:any)=>void;
    placeholder?:string
}

const ChatBox:VFC<Props>=({chat,onSubmitForm,onChangeChat,setChat,placeholder})=>{
    const { workspace } = useParams<{ workspace: string }>();
    const textareaRef=useRef<HTMLTextAreaElement>(null);
    const {data:userData,error,revalidate,mutate}=useSWR<IUser|false>('/api/users',fetcher);
    const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);
    useEffect(()=>{
        if(textareaRef.current){
            autosize(textareaRef.current);
        }
    },[])
    const onKeydownChat=useCallback((e)=>{
            if(e.key==='Enter'){
                if(!e.shiftKey){
                onSubmitForm(e);
                setChat('')
                }
            }
    },[onSubmitForm])
    const renderSuggesstion=useCallback(
        (
            suggestion: SuggestionDataItem, 
            search: string,
            highlightedDisplay: React.ReactNode, 
            index: number, 
            focus: boolean,
        ):React.ReactNode=>{
                if(!memberData) return;
                return(
                    <EachMention focus={focus}>
                        <img src={gravatar.url(memberData[index].email,{s:'20px',d:'retro'})} alt={memberData[index].nickname}/>
                        <span>{highlightedDisplay}</span>
                    </EachMention>
                )
             }
        ,[memberData])

    return(
        <ChatArea>
            <Form onSubmit={onSubmitForm}>
                <MentionsTextarea id='editor-chat' value={chat} onChange={onChangeChat} onKeyDown={onKeydownChat} placeholder={placeholder} inputRef={textareaRef} allowSuggestionsAboveCursor>
                    <Mention appendSpaceOnAdd trigger="@" 
                    data={memberData?.map(v=>({id:v.id,display:v.nickname}))||[]}
                    renderSuggestion={renderSuggesstion}
                    />
                </MentionsTextarea>
                <Toolbox>
                <SendButton
                    className={
                    'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
                    (chat?.trim() ? '' : ' c-texty_input__button--disabled')
                    }
                    data-qa="texty_send_button"
                    aria-label="Send message"
                    data-sk="tooltip_parent"
                    type="submit"
                    disabled={!chat?.trim()}>
                        <i className="c-icon c-icon--paperplane-filled" aria-hidden="true"/>
                    </SendButton>
                </Toolbox>
            </Form>
        </ChatArea>
    )
};

export default ChatBox;

//useRef null?