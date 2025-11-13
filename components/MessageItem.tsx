import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/Contexts/authContext";
import { MessageProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, View } from "react-native";
import Avatar from "./Avatar";
import Typo from "./Typo";

const MessageItem = ({
    item, isDirect
}:{item: MessageProps, isDirect:boolean})=>{

    const {user: currentUser} = useAuth();
    const isMe = item.isMe;

    return(
        <View
            style={[
                styles.messageContainer,
                isMe? styles.myMessage:styles.theirMessage
            ]}
        >
            {
                !isMe && !isDirect && (
                    <Avatar size={30} uri={null} style={styles.messageAvatar}/>
                )
            }
            <View 
                style={[
                    styles.messageBubble,
                    isMe? styles.myBubble:styles.theirBubble
                ]}
            >
                {!isMe && !isDirect && (
                    <Typo color={colors.neutral900} fontWeight={"600"} size={13}>
                        {item.sender.name}
                    </Typo>
                )}

                {item.content && <Typo size={15}>{item.content}</Typo>}

                <Typo 
                    style={{alignSelf:"flex-end"}}
                    size={11}
                    fontWeight={"500"}
                    color={colors.neutral600}
                >
                    {item.createdAt}
                </Typo>
            </View>
        </View>
    );
};

export default MessageItem;

const styles = StyleSheet.create({

    theirBubble:{
        backgroundColor: colors.otherBubble,
    },
    myBubble:{
        backgroundColor: colors.myBubble,
    },
    messageBubble:{
        padding:spacingX._10,
        borderRadius: radius._15,
        gap: spacingY._5,
    },
    attachment:{
        height: verticalScale(180),
        width: verticalScale(180),
        borderRadius: radius._10,
    },
    messageAvatar:{
        alignSelf:"flex-end"
    },
    theirMessage:{
        alignSelf:"flex-start"
    },
    myMessage:{
        alignSelf:"flex-end",
    },
    messageContainer:{
        flexDirection:"row",
        gap: spacingX._7,
        maxWidth:"80%",
    }

});