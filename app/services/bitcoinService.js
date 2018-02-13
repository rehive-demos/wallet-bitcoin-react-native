import BaseServiceClass from './baseService'

const BaseService = new BaseServiceClass(
    "https://bitcoin.s.services.rehive.io/api/1/"
);

class bitcoinService {
    getUserAccount() {
        console.log('getting bitcoin user')
        return BaseService.get('user/')
    }

    sendTransaction (amount, to_reference) {
        const data = {
            "amount":amount,
            "to_reference":to_reference,
        }
        return BaseService.post('wallet/send/', data)
    }
}

export default bitcoinService