import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import "./index.module.less"
import Clock from "../../assets/clock.png"
import DeleteIcon from "../../assets/deleteIconSec.png"

export interface CardProps {
    currentListItemId?: string
    _id: string
    title: string
    time: string
    isCollected?: boolean
    is_deleted?: boolean
    onDelete: (_id: string) => void
}

export default function Card(props: CardProps) {
    const { currentListItemId, _id, title, time, onDelete } = props
    const handleClick = (event: any) => {
        event.stopPropagation()
        Taro.navigateTo({ url: `/pages/detail/index?id=${_id}&currentListItemId=${currentListItemId}`, })
    }

    const handleDelete = (event) => {
        event.stopPropagation()
        onDelete(_id)
    }

    return (
        <View className='card' onClick={handleClick}>
            <img className='delete-img' src={DeleteIcon} alt='' onClick={(event) => handleDelete(event)} />
            {false && <View className='collected'>
                <View className='text'>
                    已收藏
                </View>
            </View>}
            <View className='project-name'>{title}</View>
            {/* <View className='project-summarize'>{projectSummarize}</View> */}
            <View className='bottom-info'>
                <View className='release-time'>
                    <img src={Clock} alt='' />
                    <View className='data'>{time}</View>
                </View>
                {/* <View className='city'>
                    淮安
                </View> */}
            </View>
        </View>
    )
}