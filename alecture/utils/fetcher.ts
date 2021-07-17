import axios from 'axios';

const fetcher=(url:string)=>axios.get(url,{
    withCredentials:true
}).then((response)=>response.data);

export default fetcher;
// url이 매개변수로 넘어감
// 어떨때 요청을 다시 보내는지 커스텀도 되어있고 설정해준다.
// 다른 탭 갔다가 오면 요청을 다시 보내서 데이터를 갱신한다.
// 로그인을 쿠키로 하고있는데 프론트랑 백엔드랑 다르면 쿠키가 전달이 안됨
// withCredential:true를 넣어줘야한다.
// swr이 주기로 서버에 요청을 보냄