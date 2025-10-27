import Avatar from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/Contexts/authContext";
import { verticalScale } from "@/utils/styling";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const newConversationModal = ()=>{

    const {isGroup} = useLocalSearchParams();
    // console.log("isGroup: ", isGroup);
    const isGroupMode = isGroup == "1";
    const router = useRouter();
    const [groupAvatar, setGroupAvatar] = useState<{uri: string} | null>(null);
    const [groupName, setGroupName] = useState("");
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const {user: currentUser} = useAuth();

    const onPickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                //   allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });
    
            console.log(result);
    
            if (!result.canceled) {
                setGroupAvatar(result.assets[0]);
            }
        };

        const toggleParticipant = (user:any)=>{
            setSelectedParticipants((prev:any)=>{
                if(prev.includes(user.id)){
                    return prev.filter((id: string)=> id != user.id);
                }
                return [...prev, user.id];
            })
        }

        const onSelectUser = (user:any)=>{
            if(!currentUser){
                Alert.alert("Authentication", "Please login to start a conversation.");
                return;
            }

            if(isGroupMode){
                toggleParticipant(user);
            }else{
                1//start direct conversation
            }
        };

        const createGroup = async ()=>{
            if(!groupName.trim() || !currentUser || selectedParticipants.length < 2){
                return;
            }
        }

    const contacts = [
        {
            id:"1",
            name:"Jaime Lannister",
            avatar: "https://i.pravatar.cc/150?img=11",
        },
        {
            id:"2",
            name:"Sansa Stark",
            avatar: "https://i.pravatar.cc/150?img=12",
        },
        {
            id:"3",
            name:"Yara Greyjoy",
            avatar: "https://i.pravatar.cc/150?img=13",
        }
    ];

    return(
        <ScreenWrapper isModal={true}>
            <View style={styles.container}>
                <Header
                    title={isGroupMode? "New Group" : "Select User"}
                    leftIcon={<BackButton color={colors.black}/>}
                />    
                {
                    isGroupMode &&(
                        <View style={styles.groupInfoContainer}>
                            <View style={styles.avatarContainer}>
                                <TouchableOpacity onPress={onPickImage}>
                                    <Avatar uri={groupAvatar?.uri || null} size={90} isGroup={true}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.groupNameContainer}>
                                <Input
                                    placeholder="Group Name"
                                    value={groupName}
                                    onChangeText={setGroupName}
                                />

                            </View>

                        </View>
                    )
                }

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contactList}
                >
                    {
                        contacts.map((user:any, index)=>{

                            const isSelected = selectedParticipants.includes(user.id); 
                            return(
                                <TouchableOpacity 
                                    key={index}
                                    style={[styles.contactRow, isSelected && styles.selectedContact]}
                                    onPress={()=> onSelectUser(user)}
                                >
                                    <Avatar size={45} uri={user.avatar} />
                                    <Typo fontWeight={"500"}>{user.name}</Typo>
                                    {
                                        isGroupMode && (
                                            <View style={styles.sectionIndicator}>
                                                <View style={[styles.checkbox, isSelected && styles.checked]} />
                                            </View>
                                        )
                                    }
                                </TouchableOpacity>    
                            )
                        })
                    }

                </ScrollView>

                {
                    isGroupMode && selectedParticipants.length>=2 && (
                        <View style={styles.createGroupButton}>
                            <Button 
                                onPress={createGroup}
                                disabled={!groupName.trim()}
                                loading={isLoading}
                            >
                                <Typo fontWeight={"bold"} size={17}>
                                    Create Group
                                </Typo>
                            </Button>    
                        </View>   
                    )
                }

            </View>
        </ScreenWrapper>
    )
}

export default newConversationModal;

const styles = StyleSheet.create({
    createGroupButton:{
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
        padding: spacingX._15,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.neutral200,
    },
    checked:{
        backgroundColor: colors.primary,
    },
    checkbox:{
        width: 24,
        height: 25,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: colors.primary,
    },
    sectionIndicator:{
        marginLeft: "auto",
        marginRight: spacingX._10,
    },
    contactList:{
        gap: spacingY._12,
        marginTop: spacingY._10,
        paddingTop: spacingY._10,
        paddingBottom: verticalScale(150),
    },
    selectedContact:{
        backgroundColor: colors.neutral200,
        borderRadius: radius._10,
    },
    contactRow:{
        flexDirection:"row",
        alignItems:"center",
        gap: spacingX._10,
        paddingVertical: spacingY._5,
    },
    groupNameContainer:{
        width:"100%",
    },
    avatarContainer:{
        marginBottom: spacingY._10,
    },
    groupInfoContainer:{
        alignItems:"center",
        marginTop: spacingY._10,
    },
    container:{
        marginHorizontal: spacingX._15,
        flex: 1,
    }
});