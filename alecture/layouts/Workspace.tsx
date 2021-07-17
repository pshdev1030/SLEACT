import React,{FC,useCallback} from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import axios from 'axios';
import { Redirect } from 'react-router';

const Workspace: FC=({children})=>{
    const {data,error,revalidate,mutate}=useSWR('http://localhost:3095/api/users',fetcher,{
        dedupingInterval:2000,
        // 캐시의 유지기간 2초 약간 쓰로틀링 느낌
    });

    const onLogout=useCallback(()=>{
        axios.post('http://localhost:3095/api/users/logout',null,{
            withCredentials:true
        })
        .then(()=>{
            mutate(false,false);
            // 데이터를 서버에 전송 안하고 그냥 바꾸고 나중에 한번에 바꿔버림
            // OPTIMISTIC UI 보내는 요청이 성공하거라 생각하고 사용자 데이터 먼저 바꿈 점검했는데 실패하면 데이터 수정한걸 취소함
            // PASIMISTIC UI 서버에 직접 먼저 데이터 보내고 받아옴 
        });
    },[]);

    if(data===undefined){
        return <div>로딩중...</div>
      }

    if(!data){
        return <Redirect to="/login"/>
    }

    return(
        <div>
        <button onClick={onLogout}>로그아웃</button>
        {children}
        </div>
    );
}

export default Workspace;