import Button from "@/components/Button"
import ScreenWrapper from "@/components/ScreenWrapper"
import Typo from "@/components/Typo"
import { colors } from "@/constants/theme"
import { useAuth } from "@/Contexts/authContext"
import { testSocket } from "@/socket/socketEvents"
import React, { useEffect } from "react"
import { StyleSheet } from "react-native"

const Home = ()=>{
    const {user, signOut} = useAuth();
    // console.log("user: ", user);

    useEffect(()=>{
        testSocket(testSocketCallbackHandler);
        testSocket(null);

        return()=>{
            testSocket(testSocketCallbackHandler,true)
        }
    },[]);

    const testSocketCallbackHandler = (data:any)=>{
        console.log('got response from testSocket event: ',data)
    }

    const handleLogout = async()=>{
        await signOut();
    };
    return(
        <ScreenWrapper>
            <Typo color={colors.white}>Home</Typo>

            <Button onPress={handleLogout}>
                <Typo>LogOut</Typo>
            </Button>
        </ScreenWrapper>
    );
};

export default Home

const styles = StyleSheet.create({});