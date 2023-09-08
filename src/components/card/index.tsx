import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import "./index.module.less"
import Clock from "../../assets/clock.png"

export interface CardProps {
    id: string
    projectName: string
    projectSummarize: string
    releaseTime: string
}

export default function Card(props: CardProps) {
    const { id, projectName, projectSummarize, releaseTime } = props
    const handleClick = () => {
        Taro.navigateTo({ url: `/pages/detail/index?id=${id}`, })
    }

    return (
        <View className='card' onClick={handleClick}>
            <View className='project-name'>{projectName}</View>
            <View className='project-summarize'>{projectSummarize}</View>
            <View className='bottom-info'>
                <View className='release-time'>
                    <img src={Clock} alt='' />
                    <View className='data'>{releaseTime}</View>
                </View>
                <View className='city'>
                    淮安
                </View>
            </View>
        </View>
    )
}