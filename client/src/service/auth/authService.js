import axios from "axios";

const apiUrl = '/api';

export async function signIn(data) {
    console.log(data);
    const fd = new FormData();
    Object.keys(data).forEach(key => {
        fd.append(key, data[key]);
    });
    const res = await axios.post(apiUrl + '/sign-in', fd);
    console.log(res);
}

export async function signOut() {
    const res = await axios.get(apiUrl + '/sign-out');
    console.log(res);
}