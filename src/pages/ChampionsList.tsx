import React from "react";
import styled from "styled-components";
import Champion from "../components/Champion"
import axios from 'axios'
import ChampionModel from "../models/ChampionModel";
import classnames from 'classnames'
import tierImg from '../assets/icon-champion-p.png';
import tierImgN from '../assets/icon-champion-n.png';
import questionmark from '../assets/icon-info.png';
import hangul from 'hangul-js';
import ChampionTrendItem from "../components/ChampionTrendItem";
import ChampionTrendHeader from "../components/ChampionTrendHeader";
import ChampionTrendToolbar from "../components/ChampionTrendToolbar";
import ChampionTrendModel from "../models/ChampionTrendModel";
// List of champion page

const ChampionListPageWrapper = styled.div`
    display: flex;
    width: 1080px;
    margin: 0 auto;
    margin-top: 100px;
`;

interface ChampionListProps {

}

interface ChampionListState {
    allChampions: ChampionModel[];
    champions: ChampionModel[];
    type: string;
    trendChampions: ChampionTrendModel[];

    trendType: string;
    trendPosition: string;
}

export default class ChampionsList extends React.Component<ChampionListProps, ChampionListState> {
    constructor(props: ChampionListProps) {
        super(props);

        this.state = {
            allChampions: [],
            champions: [],
            type: "ALL",

            trendChampions: [],
            trendType: "tier",
            trendPosition: "top"
        }
    }
    getConsonant = (arr: string[][]) => {
        let result = "";
        for (let i = 0; i < arr.length; i++) {
            if (hangul.isConsonant(arr[i][0])) {
                result += arr[i][0]
            }
        }
        return (result);
    }

    splitConsonant = (arr: string) => {
        let temp = hangul.disassemble(arr);
        let res = "";
        for (let i = 0; i < temp.length; i++) {
            res += temp[i];
        }
        return res;
    }

    async componentDidMount() {
        const response = await axios.get("http://opgg.dudco.kr/champion");
        const allChampions = response.data.map((data: any) => {
            return new ChampionModel({
                id: data.id,
                name: data.name,
                key: data.key,
                position: data.position, //가렌 => [[ㄱ,ㅏ],[ㄹ,ㅔ,ㄴ]]
                consonant: this.getConsonant(hangul.disassemble(data.name, true))
            })
        })
        const trendChampions = await this.getTrendList("tier");
        this.setState({ allChampions, champions: allChampions, trendChampions});
    }   

    onChangeType = (type: string) => () => {
        document.querySelectorAll("input")[1].value = "";
        this.setState({
            type,
            champions: this.filterChampions(type),
        });
    }

    filterChampions = (type: string) => {
        switch (type) {
            case "TOP":
                return this.state.allChampions.filter((c, idx) => c.position!!.indexOf("탑") > -1);
            case "JUG":
                return this.state.allChampions.filter((c, idx) => c.position!!.indexOf("정글") > -1);
            case "MID":
                return this.state.allChampions.filter((c, idx) => c.position!!.indexOf("미드") > -1);
            case "ADC":
                return this.state.allChampions.filter((c, idx) => c.position!!.indexOf("바텀") > -1);
            case "SUP":
                return this.state.allChampions.filter((c, idx) => c.position!!.indexOf("서포터") > -1);
            default:
                return this.state.allChampions;
        }
    }

    searchChampion = (searchValue: string) => {
        if (searchValue === "") {
            return this.filterChampions(this.state.type);
        }
        else if (hangul.isConsonantAll(searchValue)) {
            const res = this.splitConsonant(searchValue);
            return this.filterChampions(this.state.type).filter((c, idx) => c.consonant!!.indexOf(res) > -1);
        }
        else {
            return this.filterChampions(this.state.type).filter((c, idx) => c.name!!.indexOf(searchValue) > -1);
        }


    }

    onChangeSearch = (e: any) => {
        this.setState({
            champions: this.searchChampion(e.target.value)
        });
    }

    onClickTrendType = (type: string) => async () => {
        const trendChampions = await this.getTrendList(type);
    
        this.setState({
            trendType: type,
            trendChampions,
            trendPosition: type === "tier" ? "top" : "all"
        });
    }

    getTrendList = async (type:string, position?: string) => {
        if(!position){
            if(type==="tier"){
                position="top"
            } else {
                position = "all"
            }
        }
        const responseTrend = await axios.get(`http://opgg.dudco.kr/champion/trend/${type}/${position}`);

        const trendChampions = responseTrend.data.map((data:any) => 
            new ChampionTrendModel({
                id: data.id,
                rank: data.rank,
                change: data.change,
                name: data.name,
                position: data.position,
                winrate: data.winRate,
                pickrate: data.pickRate,
                banrate: data.banRate,
                tierIcon: data.tierIcon
            })
        );
        return trendChampions;
    }

    onClickTrendPosition = (position: string) => async() => {
        const trendChampions = await this.getTrendList(this.state.trendType, position);
        this.setState({trendChampions, trendPosition: position});
    }


    render() {
        return (
            <ChampionListPageWrapper>
                <ChampionsWrapper>
                    <div className="header">
                        <div className="item-wrap">
                            <div className={classnames("item", { select: this.state.type === "ALL" })} onClick={this.onChangeType("ALL")}>전체</div>
                            <div className={classnames("item", { select: this.state.type === "TOP" })} onClick={this.onChangeType("TOP")}>탑</div>
                            <div className={classnames("item", { select: this.state.type === "JUG" })} onClick={this.onChangeType("JUG")}>정글</div>
                            <div className={classnames("item", { select: this.state.type === "MID" })} onClick={this.onChangeType("MID")}>미드</div>
                            <div className={classnames("item", { select: this.state.type === "ADC" })} onClick={this.onChangeType("ADC")}>바텀</div>
                            <div className={classnames("item", { select: this.state.type === "SUP" })} onClick={this.onChangeType("SUP")}>서포터</div>
                        </div>
                        <input type="text" placeholder="챔피언 검색 (가렌, ㄱㄹ, ...)" onChange={this.onChangeSearch} />
                    </div>
                    <div className="list">
                        {
                            this.state.champions.map((data) =>
                                <Champion
                                    key={data.id}
                                    id={Number(data.id) || 0}
                                    position={data.position || []}
                                    name={data.name || ""}
                                />
                            )

                        }
                        {[1, 2, 3, 4, 5, 6].map(() => <div style={{ width: "82px", height: 0 }} />)}
                    </div>
                </ChampionsWrapper>
                <ChampionTrendWrapper>
                    <div className="header">
                        <div>챔피언 순위</div>
                        <div className="item-wrap">
                            <div className={classnames("item", {select: this.state.trendType === "tier"})} onClick={this.onClickTrendType("tier")}><img src={this.state.trendType === "tier" ? tierImg : tierImgN} />티어</div>
                            <div className={classnames("item", {select: this.state.trendType === "winratio"})} onClick={this.onClickTrendType("winratio")}>승률</div>
                            <div className={classnames("item", {select: this.state.trendType === "pickratio"})} onClick={this.onClickTrendType("pickratio")}>픽률</div>
                            <div className={classnames("item", {select: this.state.trendType === "banratio"})} onClick={this.onClickTrendType("banratio")}>밴률</div>
                        </div>
                    </div>
                    <div className="list">
                        <ChampionTrendToolbar className ="list-item">
                            <div className={classnames("",{select: this.state.trendPosition === "all"})} hidden={this.state.trendType === "tier"} onClick={this.onClickTrendPosition("all")}>전체</div>
                            <div className={classnames("",{select: this.state.trendPosition === "top"})} onClick={this.onClickTrendPosition("top")}>탑</div>
                            <div className={classnames("",{select: this.state.trendPosition === "jungle"})} onClick={this.onClickTrendPosition("jungle")}>정글</div>
                            <div className={classnames("",{select: this.state.trendPosition === "mid"})} onClick={this.onClickTrendPosition("mid")}>미드</div>
                            <div className={classnames("",{select: this.state.trendPosition === "adc"})} onClick={this.onClickTrendPosition("adc")}>바텀</div>
                            <div className={classnames("",{select: this.state.trendPosition === "support"})} onClick={this.onClickTrendPosition("support")}>서포터</div>
                        </ChampionTrendToolbar>
                        <ChampionTrendHeader className="list-item">
                            <div>#</div>
                            <div>챔피언</div>
                            <div hidden={this.state.trendType === "banratio"}>승률</div>
                            <div hidden={this.state.trendType === "banratio"}>픽률</div>
                            <div hidden={this.state.trendType !== "tier"}>티어<div className="tooltip"><img src={questionmark}/></div></div>
                            <div hidden={this.state.trendType !== "banratio"}>밴률</div>
                        </ChampionTrendHeader>
                        {/* <ChampionTrendItem/> */}

                        {this.state.trendChampions.map(c => 
                            <ChampionTrendItem ChampionID={c.id} name={c.name} position={c.position} change={c.change}win={c.winrate} pick={c.pickrate} tier={c.tierIcon} rank={c.rank}type={this.state.trendType} ban={c.banrate}/>
                            )}
                    </div>
                    
                </ChampionTrendWrapper>
                
            </ChampionListPageWrapper>
        )
    }
}

const ChampionsWrapper = styled.div`
    border-right: 1px solid #e9eff4;
    margin-right: 1px;
    & > .header {
        display: flex;
        background-color: white;
        justify-content: space-between;
        padding: 0 17px; 
        border-bottom: 1px solid #e9eff4;

        & > .item-wrap {
            display: flex;
        }

        & > .item-wrap > .item {
            line-height: 60px;
            margin: 0 12px;
            color: rgba(0,0,0, .6);
            cursor: pointer;
            &.select {
                box-shadow:0px -3px 0px 0px #5383e8 inset;
                color: #5383e8;
                font-weight: bold;
            }
        }
        & > input {
            width: 200px;
            margin: 10px 0;
            padding: 0 10px;
            border: none;
            background-color: #f7f7f7;
        }
    }
    & > .list {
        width:564px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 30px;
        background-color: #f7f7f7;
    }
    
`;




const ChampionTrendWrapper = styled.div`
    flex: 1;
    background-color: white;
    
    & > div.header{
        display: flex;
        justify-content: space-between;
        line-height:60px;
        
        & > div:first-child {
            font-weight: bold;
            margin-left: 20px;
        }
        & > .item-wrap{
            display: flex;
            & > .item {
                display: flex;
                align-items: center;
                cursor: pointer;
                & > img {
                    margin-right: 3px;
                }
                padding-left: 12px;
                padding-right: 12px;
                position: relative;
                &.select {
                    box-shadow:0px -3px 0px 0px #5383e8 inset;
                    color: #5383e8;
                    font-weight: bold;
                }
                &:not(:last-child)::after{
                    content: "";
                    background: rgba(209, 209, 224, .3);
                    position: absolute;
                    bottom: 25%;
                    right: 0;
                    height: 50%;
                    width: 0.5px;
                }
            }
        }
    }

    & > .list {
        background-color: #f7f7f7;
        padding: 20px;

        &> .list-item {
        }
    }
`;