
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, Lock, User, UserPlus } from 'lucide-react-native';

const SignUpScreen = ({ onSignInPress }) => {
    const { control, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch('password');

    const onSubmit = (data) => {
        console.log(data);
        // Handle sign up logic
    };

    return (
        <AuthLayout>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the revolution in fitness</Text>
                </View>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: 'Full Name is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Full Name"
                                placeholder="Enter your full name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                icon={User}
                                error={errors.fullName?.message}
                            />
                        )}
                        name="fullName"
                    />

                    <Controller
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                icon={Mail}
                                error={errors.email?.message}
                            />
                        )}
                        name="email"
                    />

                    <Controller
                        control={control}
                        rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Password"
                                placeholder="Create a password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry
                                icon={Lock}
                                error={errors.password?.message}
                            />
                        )}
                        name="password"
                    />

                    <Controller
                        control={control}
                        rules={{
                            required: 'Please confirm your password',
                            validate: value => value === password || 'Passwords do not match'
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry
                                icon={Lock}
                                error={errors.confirmPassword?.message}
                            />
                        )}
                        name="confirmPassword"
                    />

                    <Button
                        title="Sign Up"
                        onPress={handleSubmit(onSubmit)}
                        icon={UserPlus}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={onSignInPress}>
                            <Text style={styles.link}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        fontFamily: 'Outfit-Bold',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: 'Outfit-Regular',
    },
    form: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        marginBottom: 24,
    },
    footerText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
    },
    link: {
        color: '#CDF27E',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Outfit-Bold',
    },
});

export default SignUpScreen;
