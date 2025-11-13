import Avatar from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import MessageItem from "@/components/MessageItem";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/Contexts/authContext";
import { uploadFileToCloudinary } from "@/services/imageService";
import { scale, verticalScale } from "@/utils/styling";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from "react-native";


const Conversation = () => {

    const { user: currentUser } = useAuth();
    const {
        id: conversationId,
        name,
        participants: stringifiedParticipants,
        avatar,
        type
    } = useLocalSearchParams();
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const participants = JSON.parse(stringifiedParticipants as string);

    let conversationAvatar = avatar;
    let isDirect = type == 'direct';
    const otherParticipant = isDirect
        ? participants.find((p: any) => p._id != currentUser?.id)
        : null;

    if (isDirect && otherParticipant)
        conversationAvatar = otherParticipant.avatar;

    let conversationName = isDirect ? otherParticipant.name : name;

    // console.log("got conversation data: ", data);

    const dummyMessages = [
        {

        }
    ]

    const onPickFile = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            //   allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setSelectedFile(result.assets[0]);
        }
    };

    const onSend = async () => {
        if(!message.trim() && !selectedFile) return;

        if(!currentUser) return;

        setLoading(true);

        try{
            let attachement = null; 
            if(selectedFile){
                const uploadResult = await uploadFileToCloudinary(
                    selectedFile,
                    "message-attachements"
                );

                if(uploadResult.success){
                    attachement = uploadResult.data;
                }else{
                    setLoading(false);
                    Alert.alert("Error", "Could not send the image");
                }

            }

            console.log("attachement: ", attachement);

        }catch(error){
            console.log("Error sending message: ",error);
            Alert.alert("Error", "Failed to send message");
        }finally{
            setLoading(false);
        }
    }

    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5}>
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? "padding" : "height"}
                style={styles.container}
            >
                {/*Header*/}
                <Header
                    style={styles.header}
                    leftIcon={
                        <View style={styles.headerLeft}>
                            <BackButton />
                            <Avatar
                                size={40}
                                uri={conversationAvatar as string}
                                isGroup={type == "group"}
                            />
                            <Typo color={colors.white} fontWeight={"500"} size={22}>
                                {conversationName}
                            </Typo>
                        </View>
                    }
                    rightIcon={
                        <TouchableOpacity style={{marginBottom: verticalScale(7)}}>
                            <Icons.DotsThreeOutlineVerticalIcon weight="fill" color={colors.white} />
                        </TouchableOpacity>
                    }
                />

                {/*messages*/}
                <View style={styles.content}>
                    <FlatList
                        data={dummyMessages}
                        inverted={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.messagesContent}
                        renderItem={({ item }) => (

                            <MessageItem item={item} isDirect={isDirect} />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                    <View style={styles.footer}>
                        <Input
                            value={message}
                            onChangeText={setMessage}
                            containerStyle={{
                                paddingLeft: spacingX._10,
                                paddingRight: scale(65),
                                borderWidth: 0
                            }}
                            placeholder="Type a message"
                            icon={
                                <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                                    <Icons.PlusIcon
                                        color={colors.black}
                                        weight="bold"
                                        size={verticalScale(22)}
                                    />
                                    {
                                        selectedFile && selectedFile.uri && (
                                            <Image
                                                source={{ uri: selectedFile.uri }}
                                                style={styles.selectedFile}
                                            />
                                        )
                                    }
                                </TouchableOpacity>
                            }
                        />
                        <View style={styles.InputRightIcon}>
                            <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                                {
                                    loading ? (
                                        <Loading size="small" color={colors.black} />
                                    ) : (
                                        <Icons.PaperPlaneTiltIcon
                                            color={colors.black}
                                            weight="fill"
                                            size={verticalScale(22)}
                                        />
                                    )
                                }

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

export default Conversation;

const styles = StyleSheet.create({

    plusIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: 8,
    },
    messagesContent: {
        paddingTop: spacingY._20,
        paddingBottom: spacingY._10,
        gap: spacingY._12,
    },
    messagesContainer: {
        flex: 1,
    },
    footer: {
        paddingTop: spacingY._7,
        paddingBottom: verticalScale(22),
    },
    inputIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: 8,
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        overflow: "hidden",
        paddingHorizontal: spacingX._15,
    },
    selectedFile: {
        position: "absolute",
        height: verticalScale(38),
        width: verticalScale(38),
        borderRadius: radius.full,
        alignSelf: "center",
    },
    InputRightIcon: {
        position: "absolute",
        right: scale(10),
        top: verticalScale(15),
        paddingLeft: spacingX._12,
        borderLeftWidth: 1.5,
        borderLeftColor: colors.neutral300,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._12,
    },
    header: {
        paddingHorizontal: spacingX._15,
        paddingTop: spacingY._10,
        paddingBottom: spacingY._15,
    },
    container: {
        flex: 1,
    }

});