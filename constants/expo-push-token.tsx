var pushToken: string | null;

export const setPushToken = (token: string | null) => {
    pushToken = token;
}

export const getPushToken = () => {
    return pushToken;
}