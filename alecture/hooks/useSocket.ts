  
import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';
//훅으로 전역 데이터로 관리
const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
// emit으로 보내고 on으로 받고 이벤트명 일치할 떄만 받는다.
// https://developer.mozilla.org/ko/docs/orphaned/Web/JavaScript/Reference/Operators/delete