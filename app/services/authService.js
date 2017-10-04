import BaseService from './baseService'

var authService = {
    login: (data) => {
        return BaseService.post('auth/login/', data)
    },

    signup: (data) => {
        return BaseService.post('auth/register/', data)
    },

    logout: () => {
        return BaseService.postWithoutBody('auth/logout/')
    },

    forgetPassword: (data) => {
        return BaseService.post('auth/password/reset/', data)
    },

    changePassword: (data) => {
        return BaseService.post('auth/password/change/', data)
    },
    twoFactorAuth:()=>{
        return BaseService.get('auth/mfa/')
    },
    twoFactorAuthPost:(data)=>{
        return BaseService.post('auth/mfa/',data)
    },
    smsAuthGet:()=>{
        return BaseService.get('auth/mfa/sms/')
    },
    smsAuthPost:(data)=>{
        return BaseService.post('auth/mfa/sms/',data)
    },
    authOptionDelete:()=>{
        return BaseService.delete('auth/mfa/sms/')
    },
    authVerify:(data)=>{
        return BaseService.post('auth/mfa/verify/',data)
    }
}

export default authService
