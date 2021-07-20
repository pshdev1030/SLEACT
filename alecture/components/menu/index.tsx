import React,{CSSProperties, FC, useCallback} from 'react';
import {CreateMenu,CloseModalButton} from './styles';

interface Props{
    show:boolean;
    onCloseModal:(e:any)=>void;
    style:CSSProperties;
    closeButton?:boolean;
}

const Menu:FC<Props>=({children,style,show,onCloseModal,closeButton})=>{

    const stopPropagation=useCallback((e)=>{
        e.stopPropagation();
    },[])

    if(!show) return null;

    return(
        <CreateMenu onClick={onCloseModal}>
            <div style={style} onClick={stopPropagation}>
                {closeButton&&<CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                {children}
            </div>
        </CreateMenu>

    );
}

Menu.defaultProps={
    closeButton:true,
}
// prop의 기본값

export default Menu;
// interface의 형태로 props를 전달
// 메뉴 바깥을 눌렀을 때 메뉴가 닫히게  부모에 닫는거 연결, 그리고 부모에 클릭이벤트 전달 안하도록 propagation