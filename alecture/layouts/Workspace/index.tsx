import React,{VFC,useCallback,useState} from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import axios from 'axios';
import { Redirect, useParams } from 'react-router';
import {Link, Route,Switch} from 'react-router-dom'
import gravatar from 'gravatar'
import { Header, WorkspaceWrapper,RightMenu,ProfileImg,Workspaces,Channels,WorkspaceName,Chats, MenuScroll, ProfileModal, LogOutButton, WorkspaceButton, AddButton, WorkspaceModal } from '@layouts/Workspace/styles';
import loadable from '@loadable/component';
import Menu from '@components/menu';
import CreateChannelModal from '@components/CreateChannelModal';
import { IChannel, IUser, IWorkspace } from '@typings/db';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import { useEffect } from 'react';
import useSocket from '@hooks/useSocket';
const Channel= loadable(()=>import('@pages/Channel'));
const DirectMessage=loadable(()=>import('@pages/DirectMessage'));


const Workspace: VFC=()=>{
    const {workspace}=useParams<{workspace:string}>();
    const {data:userData,error,revalidate,mutate}=useSWR<IUser|false>('/api/users',fetcher,{
        dedupingInterval:2000,
        // 캐시의 유지기간 2초 약간 쓰로틀링 느낌
    });
    const {data:channelData}=useSWR<IChannel[]>(
        userData?`/api/workspaces/${workspace}/channels`:null,
        fetcher);
    // 로그인한 상태에만 요청을 보내도록
    const [showUserMenu,setShowUserMenu]=useState(false);
    const [showCreateWorkspaceModal,setShowCreateWorkspaceModal]=useState(false);
    const [showWorkspaceModal,setShowWorkspaceModal]=useState(false);
    const [showCreateChannelModal,setShowCreateChannelModal]=useState(false);
    const [showInviteWorkspaceModal,setShowInviteWorkspaceModal]=useState(false);
    const [showInviteChannelModal,setShowInviteChannelModal]=useState(false);
    const [newWorkspace,onChangeWorkspace,setNewWorkspace]=useInput('');
    const [newUrl,onChangeUrl,setNewUrl]=useInput('');
    const [socket,disconnect]=useSocket(workspace);

    useEffect(()=>{
        if(channelData&&userData&&socket){
            socket.emit('login',{id:userData,channels:channelData.map((v)=>v.id)})
        }
    },[socket,channelData,userData])

    useEffect(()=>{
        return()=>{
            disconnect();
        }
    },[workspace,disconnect])
    // workspace바뀔 때 연결 끊음

    const onLogout=useCallback(()=>{
        axios.post('api/users/logout',null,{
            withCredentials:true
        })
        .then(()=>{
            mutate(false,false);
            // 데이터를 서버에 전송 안하고 그냥 바꾸고 나중에 한번에 바꿔버림
            // OPTIMISTIC UI 보내는 요청이 성공하거라 생각하고 사용자 데이터 먼저 바꿈 점검했는데 실패하면 데이터 수정한걸 취소함
            // PASIMISTIC UI 서버에 직접 먼저 데이터 보내고 받아옴 
        });
    },[]);

    const onClickUserProfile=useCallback((e)=>{
        e.stopPropagation();
        setShowUserMenu((prev)=>!prev);
    },[])
    // menu에서 상위컴포넌트로 이벤트 버블링 안되도록

    const toggleWorkspaceModal=useCallback((e)=>{
        e.stopPropagation();
        setShowWorkspaceModal((prev)=>!prev);
    },[]);

    const onClickCreateWorkspace=useCallback(()=>{
        setShowCreateWorkspaceModal(true);
    },[]);

    const onCreateWorkspace=useCallback((e)=>{
        e.preventDefault();
        if(!newWorkspace||!newWorkspace.trim()||!newUrl||!newUrl.trim()){
        toast.error
            ('입력되지 않은 정보가 있습니다.',{ 
                autoClose: 3000 ,
                position: toast.POSITION.BOTTOM_CENTER
            });
        return ;
        }
        
        axios.post('/api/workspaces',{
            workspace:newWorkspace,
            url:newUrl
        },{
            withCredentials:true
        }).then(()=>{
            revalidate();
            setShowCreateWorkspaceModal(false);
            setNewWorkspace('');
            setNewUrl('');
        }).catch((error)=>{
            console.dir(error);
            toast.error
            (error.response?.data,{ 
                autoClose: 3000 ,
                position: toast.POSITION.BOTTOM_CENTER
            });
        });
    },[newWorkspace,newUrl])

    const onCloseModal=useCallback(()=>{
        setShowCreateWorkspaceModal(false);
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    },[])
    
    const onClickInviteWorkspace=useCallback(()=>{
        setShowInviteWorkspaceModal((prev)=>!prev);
    },[])

    const onClickAddChannel=useCallback(()=>{
        setShowCreateChannelModal((prev=>!prev))
    },[])

    if(userData===undefined){
        return <div>로딩중...</div>
      }

    if(!userData){
        return <Redirect to="/login"/>
    }

    return(
        <div>
        <Header>test</Header>
        <RightMenu>
            <span onClick={onClickUserProfile}>
                <ProfileImg src={gravatar.url(userData.email,{s:'28px',d:'retro'})} alt={userData.nickname}/>
                {showUserMenu&&
                <Menu style={{right:0,top:38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                <img src={gravatar.url(userData.email,{s:'28px',d:'retro'})} alt={userData.nickname}/>
                <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>}
            </span>
        </RightMenu>
        <WorkspaceWrapper>
            <Workspaces>{userData.Workspaces.map((ws:IWorkspace)=>{
                return(
                    <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                        <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                    </Link>
                )
            })}
            <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
            </Workspaces>
            <Channels>
                <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
                <MenuScroll>
                    <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top:95,left:80}}>
                        <WorkspaceModal>
                            <h2>Sleact</h2>
                            <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                            <button onClick={onClickAddChannel}>채널 만들기</button>
                            <button onClick={onLogout}>로그 아웃</button>
                        </WorkspaceModal>
                    </Menu>
                    <ChannelList/>
                    <DMList/>
                </MenuScroll>
            </Channels>
            <Chats>
                <Switch>
                    <Route path="/workspace/:workspace/channel/:channel" component={Channel}/>
                    <Route path="/workspace/:workspace/dm/:id" component={DirectMessage}/>
                    {/* 중첩라우팅하려면 주소가 구조가 똑같아야 한다. */}
                </Switch>
            </Chats>
            <ToastContainer/>
        </WorkspaceWrapper>
        <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateWorkspace}>
                <Label id="workspace-label">
                    <span>워크스페이스 이름</span>
                    <Input id="workspace" value={newWorkspace} onChange={onChangeWorkspace}/>
                </Label>
                <Label id="workspace-url-label">
                    <span>워크스페이스 url</span>
                    <Input id="workspace" value={newUrl} onChange={onChangeUrl}/>
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
        <CreateChannelModal
            show={showCreateChannelModal} 
            onCloseModal={onCloseModal}
            setShowCreateChannelModal={setShowCreateChannelModal}/>
        <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal} setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}/>
        <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal}/>
        </div>
    );
}

export default Workspace;

//1. 페이지에서 레이아웃으로 감싸줘서 레이아웃에선 children으로 받음 => 주소가 계층적이지 않음
//2. Workspace 제거하고 Workspace 자체에서 children이 누가 될지 판단하는거 =>주소가 계층적임
// 재사용 될만한 컴포넌트들 작성후 하나의 컴포넌트는 하나의 역할만 하도록 코딩
// input이 스테이트를 계속 바꿔서 input 들어가면 컴포넌트 나누는게 ㅈㅎ음
// 그래서 모달을 아래쪽에 나눠서 배치