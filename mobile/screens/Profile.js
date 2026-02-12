import {View, Text, StyleSheet} from 'react-native';

// TODO 1: CONNECT WITH SUPABSE 
// SUPABASE TABLES: USERS, EXERCISES (for starters)
// TODO 2: LOOK FOR DUMMY DATA TO FILL THIS WITH FOR TESTING

export default function Header() {

    // TODO 3: FUNCTIONS WITH axios TO CONNECT AND USE DATABSE
    // GET -> RETRIEVE USER INFORMATION (IMG, USERNAME, EMAIL, …)
    // PUT -> UPDATE USER INFORMATION

    // TODO 4: CONNECT DB WITH EMAIL, SO WHEN CONNECTING OR CHANGING EMAIL, YOU CAN RECEIVE ONE
    // RECEIVE EMAIL OK BUT FROM WHO AND HOW ??? ==> RESEARCH

    // SHOULD WE OFFER THE POSSIBILITY TO DELETE YOUR ACCOUNT ??

    return(
        <View>
            <Text style={{fontSize: 30}} >This is the Profile Screen</Text>
            {/* Consider importing Card element from '@rneui/themed' */}
            <View>
                {/* Image (circle) + change photo(cam & choose) */}
                {/* Name and email */}
            </View>
            <View>
                {/* List of parameters and the ability to change each */}
                {/* Preferences + usename + email + measurements (weight, height, …) */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10, 
        matgins: 10,

    },
    image: {
        borderRadius: 30,
    }
})