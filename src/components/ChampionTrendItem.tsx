import React from 'react';
import styled, { css } from "styled-components";

import tier1Img from '../assets/icon-champtier-1.png'
import tier2Img from '../assets/icon-champtier-2.png'
import tier3Img from '../assets/icon-champtier-3.png'
import tier4Img from '../assets/icon-champtier-4.png'
import tier5Img from '../assets/icon-champtier-5.png'
import classnames from 'classnames';
import champ32 from '../assets/champion32.png';
import tierstay from '../assets/icon-championtier-stay.png';
import tierUp from '../assets/icon-championtier-up.png';
import tierDown from '../assets/icon-championtier-down.png';
import ChampionTrendHeader, { ChampionTrendItemCss } from './ChampionTrendHeader';

const ChampionTrendItemWrapper = styled(ChampionTrendHeader)`
    ${ChampionTrendItemCss};
    background-color: white;
    display: flex; 
    flex-direction: column-reverse;
    border: 1px solid #e9eff4;

    &:not(:last-child) {
        border-bottom: none;
    }
    & > .rank {
        font-style: italic;
        font-size: 20px;
    }

    & > .champ {
        display: flex;
        align-items: center;
        text-align: left;
        & > .change {
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 14px;
            padding: 0 10px;
            width:50px;
            box-sizing: border-box;
            & > img {
                margin-right: 2px;
            }

            &.up {
                color: green;
            }

            &.down {
                color: red;
            }
        }
    
        & > .champ-img {
            width: 32px;
            height: 32px;
            background-image: url(${champ32});  
        }

        & > .champ-desc {
            font-size: 12px;
            display:flex;
            margin-left: 5px;
            flex-direction: column;
            justify-content: space-between;
            & > :first-child {
                font-weight: bold;
            }
        }   
    }

    & > .select{
        font-weight:bold;
        color: #4a90e2;
    }
`;



interface ChampionTrendItemProps {
    ChampionID: number;
    change: number;
    name: string;
    position: string;
    win: string;
    pick: string;
    tier: string;
    ban: string;
    rank: string;
    type: string;
}

const ChampionTrendItem: React.FC<ChampionTrendItemProps> = (props) => {
    const getTierChangeIcon = () => {
        if(props.change > 0) {
            return tierUp;
        } else if(props.change <0) {
            return tierDown;
        } else {
            return tierstay;
        }
    }
    
    return (
        <ChampionTrendItemWrapper className="list-item champion">
            <div className="rank">{props.rank}</div>
            <div className="champ">
                <div className={classnames("change", {up: props.change >0, down: props.change <0})} >
                    <img src={getTierChangeIcon()} alt="" />
                    {Math.abs(props.change)}
                </div>
                {/* <div className="champ-img" /> */}
                <div className={`champ-img __spc32-${props.ChampionID}`}></div>
                <div className="champ-desc">
                    <div>{props.name}</div>
                    <div>{props.position}</div>
                </div>
            </div>
            
            <div className={classnames("win", {select: props.type === "winratio"})} hidden={props.type === "banratio"}>{props.win}</div>
            <div className={classnames("pick", {select: props.type === "pickratio"})} hidden={props.type === "banratio"}>{props.pick}</div>
            <div className={classnames("ban", {select: props.type === "banratio"})} hidden={props.type !== "banratio"}>{props.ban}</div>
            <div className="tier" hidden={props.tier === ""}>
                <img src={props.tier} alt="" />
            </div>
        </ChampionTrendItemWrapper >
    )
}

export default ChampionTrendItem;