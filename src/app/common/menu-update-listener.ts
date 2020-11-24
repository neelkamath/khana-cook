import {getAccessToken, handleInvalidAccessToken} from './access-token';
import {NzMessageService} from 'ng-zorro-antd/message';

export function listenForMenuUpdates(socket: WebSocket, message: NzMessageService, callback: () => void): void {
    const token = getAccessToken();
    if (token === null) {
        handleInvalidAccessToken(message);
        return;
    }
    socket.addEventListener('open', () => socket.send(token));
    socket.addEventListener('message', async ({data}) => {
        if (['MENU_UPDATE', 'ORDER'].includes(JSON.parse(data).type)) callback();
    });
}
