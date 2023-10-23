import { View } from "@tarojs/components"
import ArrowRight from "@/assets/arrowRight.png"
import Taro, { useDidShow, useRouter } from "@tarojs/taro"
import { useEffect, useState } from "react"
import { findUserById } from "@/services/findUserById"
import { updateUserAvatorURL } from "@/services/updateUserAvatorURL"
import "./index.module.less"
import { Role } from "../usersManage"

interface PersonalInfoProps {
    userId?: string
    avatorUrl?: string
    username?: string
    roleId?: string
    roleName?: string
    password?: string
}

const PersonalInfo = () => {

    const router = useRouter()
    const { userId } = router.params
    const [userinfo, setUserinfo] = useState<PersonalInfoProps | null>(null)

    useDidShow(() => {
        init()
    })

    useEffect(() => {
        init()
    }, [])

    async function init() {
        const res = await findUserById(userId)
        if (!res) return
        const roleListRes = await Taro.getStorage({ key: "roleList" })
        if (!roleListRes) return
        setUserinfo({
            userId,
            avatorUrl: res.result[0].avatorUrl,
            username: res.result[0].username,
            roleId: res.result[0].roleId,
            roleName: roleListRes.data.find((role: Role) => role.roleId === res.result[0].roleId).roleName,
            password: res.result[0].password
        })
        return true
    }

    async function changeAvator() {
        const res = await Taro.showActionSheet({
            itemList: ['从手机相册选择']
        })
        if (!res) return
        if (res.tapIndex === 0) {
            const chooseImgRes = await Taro.chooseImage({
                count: 1,
                sizeType: ["original"],
                sourceType: ["album"],
            })
            Taro.showLoading({
                title: "头像更新中"
            })
            if (!chooseImgRes) return
            const uploadFileRes = await Taro.cloud.uploadFile({
                cloudPath: 'avators/' + Date.now() + "." + chooseImgRes.tempFilePaths[0].split(".")[1],
                filePath: chooseImgRes.tempFilePaths[0]
            })
            if (!uploadFileRes) return
            const tempFileURLRes = await Taro.cloud.getTempFileURL({
                fileList: [uploadFileRes.fileID]
            })
            if (!tempFileURLRes) return
            const updateAvatorURLRes = await updateUserAvatorURL(userId, tempFileURLRes.fileList[0].tempFileURL)
            if (!updateAvatorURLRes) return
            const initRes = await init()
            if (!initRes) return
            Taro.hideLoading()
            return
        }
        return
    }

    function tabClick(index: number) {
        if (index === 0) {
            Taro.navigateTo({ url: `/pages/setUsername/index?userId=${userId}&userName=${userinfo?.username}` })
            return
        }
        if (index === 1) {
            Taro.navigateTo({ url: `/pages/setPassword/index?userId=${userId}&password=${userinfo?.password}` })
            return
        }
        if (index === 2) {
            Taro.navigateTo({ url: `/pages/setRole/index?userId=${userId}&roleName=${userinfo?.roleName}` })
            return
        }
    }

    return (
        <View className='personal-info'>
            <View className='item'>
                <View className='label'>头像</View>
                <View className='right' onClick={changeAvator}>
                    <img className='avator' src={userinfo ? userinfo.avatorUrl : ""} />
                    <img className='arrow-right' src={ArrowRight} />
                </View>
            </View>
            <View className='item' onClick={() => tabClick(0)}>
                <View className='label'>用户名</View>
                <View className='right'>
                    <View className='value'>{userinfo ? userinfo.username : ""}</View>
                    <img className='arrow-right' src={ArrowRight} />
                </View>
            </View>
            <View className='item' onClick={() => tabClick(1)}>
                <View className='label'>密码</View>
                <View className='right'>
                    <View className='value'>{userinfo ? userinfo.password : ""}</View>
                    <img className='arrow-right' src={ArrowRight} />
                </View>
            </View>
            {userinfo?.roleId === "000" && <View className='item' onClick={() => tabClick(2)}>
                <View className='label'>角色</View>
                <View className='right'>
                    <View className='value'>{userinfo ? userinfo.roleName : ""}</View>
                    <img className='arrow-right' src={ArrowRight} />
                </View>
            </View>}
        </View>
    )
}

export default PersonalInfo