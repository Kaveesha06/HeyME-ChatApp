import Button from "@/components/Button"
import ConversationItem from "@/components/ConversationItem"
import ScreenWrapper from "@/components/ScreenWrapper"
import Typo from "@/components/Typo"
import { colors, radius, spacingX, spacingY } from "@/constants/theme"
import { useAuth } from "@/Contexts/authContext"
import { verticalScale } from "@/utils/styling"
import { useRouter } from "expo-router"
import * as Icons from "phosphor-react-native"
import React, { useState } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"

const Home = ()=>{
    const {user: currentUser, signOut} = useAuth();
    const router = useRouter();

    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false);
    // console.log("user: ", user);

    // useEffect(()=>{
    //     testSocket(testSocketCallbackHandler);
    //     testSocket(null);

    //     return()=>{
    //         testSocket(testSocketCallbackHandler,true)
    //     }
    // },[]);

    // const testSocketCallbackHandler = (data:any)=>{
    //     console.log('got response from testSocket event: ',data)
    // }

    const handleLogout = async()=>{
        await signOut();
    };

    const conversations = [
        {
            name: "Arisu",
            type: "direct",
            lastMessage:{
                senderName:"Arisu",
                content:"We done with Diomend, How about U?",
                createdAt: "2025-10-01T18:30:00Z",
            },
        },
        {
            name: "Michelle",
            type: "direct",
            lastMessage:{
                senderName:"Michelle",
                // attachement:{image:'url'},
                content:"Tonight BREACKOUT!!!",
                createdAt: "2025-10-04T15:05:00Z",
            },   
        },
        {
            name: "Project Sona",
            type: "group",
            lastMessage:{
                senderName:"Mahone",
                content:"How about TBag",
                createdAt: "2025-10-20T15:05:00Z",
            },   
        },
        {
            name: "La Casa De Papel",
            type: "group",
            lastMessage:{
                senderName:"Nirobi",
                content:"Shut the Fuck up Tokyo",
                createdAt: "2025-10-11T15:05:00Z",
            },   
        },
    ]

    let directConversations = conversations
    .filter((item:any)=> item.type == "direct")
    .sort((a: any, b: any)=>{
        const aDate = a?.lastMessage?.createdAt || a.createdAt;
        const bDate = b?.lastMessage?.createdAt || b.createdAt;
        return new Date(bDate).getTime()- new Date(aDate).getTime();
    });
    let groupConversations = conversations
    .filter((item:any)=> item.type == "group")
    .sort((a: any, b: any)=>{
        const aDate = a?.lastMessage?.createdAt || a.createdAt;
        const bDate = b?.lastMessage?.createdAt || b.createdAt;
        return new Date(bDate).getTime()- new Date(aDate).getTime();
    });

    // let directConversations = [];
    // let groupConversations = [];

    return(
        <ScreenWrapper showPattern={true} bgOpacity={0.4}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{flex:1}}>
                        <Typo color={colors.neutral200} size={19} textProps={{numberOfLines:1}}>
                            Welcome back, 
                            <Typo size={20} color={colors.white} fontWeight={'800'}>
                                {currentUser?.name}
                            </Typo>{" "}

                        </Typo>
                    </View>
                    <TouchableOpacity 
                        style={styles.settingIcon} 
                        onPress={()=>
                            router.push("/(main)/profileModal")}
                    >
                        <Icons.GearSixIcon 
                            color={colors.white} 
                            weight="fill" 
                            size={verticalScale(22)}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false} 
                                contentContainerStyle={{paddingVertical:spacingX._20}}
                    >
                        <View style={styles.navBar}>
                            <View style={styles.tabs}>
                                <TouchableOpacity 
                                    onPress={()=> setSelectedTab(0)} 
                                    style={[
                                        styles.tabStyle, 
                                        selectedTab==0 && styles.activeTabStyle
                                    ]}
                                >
                                    <Typo>Direct Message</Typo>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={()=> setSelectedTab(1)} 
                                    style={[
                                        styles.tabStyle, 
                                        selectedTab == 1 && styles.activeTabStyle,
                                    ]}
                                >
                                    <Typo>Groups</Typo>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.conversationList}>
                            {
                                selectedTab ==0 && directConversations.map((item: any, index)=>{
                                    return(
                                        <ConversationItem
                                            item={item}
                                            key={index}
                                            router={router}
                                            showDivider={directConversations.length != index +1}
                                        />
                                    );
                                })
                            }
                            {
                                selectedTab ==1 && groupConversations.map((item: any, index)=>{
                                    return(
                                        <ConversationItem
                                            item = {item}
                                            key={index}
                                            router={router}
                                            showDivider={directConversations.length != index +1}
                                        />
                                    );
                                })
                            } 
  
                        </View>

                        {
                            !loading && selectedTab ==0 && directConversations.length == 0 &&(
                                <Typo style={{textAlign:'center'}}>
                                    You don't have any direct messages yet.
                                </Typo>
                            )
                        }
                        {
                            !loading && selectedTab ==1 && groupConversations.length == 0 &&(
                                <Typo style={{textAlign:'center'}}>
                                    You don't have any group messages yet.
                                </Typo>
                            )
                        }

                    </ScrollView>

                </View>

            </View>

            <Button
                style={styles.floatingButton}
                onPress={()=> router.push({
                    pathname: "/(main)/newConversationModal",
                    params: {isGroup: selectedTab}
                })}
            >
                <Icons.PlusIcon
                    color={colors.black}
                    weight="bold"
                    size={verticalScale(24)}
                />
                
            </Button>    
        </ScreenWrapper>
    );
};

export default Home

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal: spacingX._20,
        gap: spacingY._15,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._20,
    },
    row:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
    },
    content:{
        flex:1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        overflow:"hidden",
        paddingHorizontal: spacingX._20,
    },
    navBar:{
        flexDirection:"row",
        gap: spacingX._15,
        alignItems: "center",
        paddingHorizontal: spacingX._10,
    },
    tabs:{
        flexDirection: "row",
        gap: spacingX._10,
        flex: 1,
        justifyContent: "center",
        alignItems:"center",
    },
    tabStyle:{
        paddingVertical: spacingY._10,
        paddingHorizontal: spacingX._20,
        borderRadius: radius.full,
        backgroundColor: colors.neutral100,
    },
    activeTabStyle:{
        backgroundColor: colors.primaryLight,
    },
    conversationList:{
        paddingVertical: spacingY._20,
    },
    settingIcon:{
        padding: spacingY._10,
        backgroundColor: colors.neutral700,
        borderRadius: radius.full,
    },
    floatingButton:{
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position:"absolute",
        bottom: verticalScale(30),
        right: verticalScale(30),
    },
});