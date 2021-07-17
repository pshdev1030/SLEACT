import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Redirect,Link } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

const LogIn = () => {
  const {data,error,revalidate,mutate}=useSWR('http://localhost:3095/api/users',fetcher,{
    dedupingInterval:10000,
  });
  // state의 성격이라 리랜더링됨
  // data가 존재하지 않으면 로딩중 존재하면 성공 error면 실패
  // revalidate() 원하는 떄에 fetcher를 실행한다.(데이터를 원하는때에 저장)
  // revalidate는 요청을 많이 보내기 떄문에 이걸 좀 조절을 해줘야댐 =>mutate();
  // mutate(데이터) 서버에 요청 안보내고 데이터를 수정한다.  (직접 수정)
  // dedupingInterval: 캐시에서 불러옴
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post( 
          '/api/users/login',
          { email, password },
          {withCredentials:true},
        )
        .then((response) => {
          mutate(response.data,false);
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
    
  );
  if(data===undefined){
    return <div>로딩중...</div>
  } 

  if(data){
    return <Redirect to="/workspace/channel"/>
  }

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
// 화면 반영은 useState 화면 반영x는 useState