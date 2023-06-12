import { LeftPanel } from './LeftPanel'
import { RocketBox } from './RocketBox'
import { AddRocketBox } from './AddRocketBox'
import { Ticker } from 'pixi.js'

export interface Props {
    leftPanel: LeftPanel;
    rockets: RocketBox[];
    addRocket: () => void;
    removeRocket: (index: number) => void;
}

export interface GlobalProps {
    rockets: RocketBox[];
    addRocket: (x: number, y: number, vx: number, vy: number) => void;
    removeRocket: (index: number) => void;
    ticker: Ticker;
}


