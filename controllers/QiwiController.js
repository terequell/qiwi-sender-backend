import axios from '../axiosInstance.js';

const RUB_CODE = 643;

export function getAuthorizationHeader(token) {
    return `Bearer ${token}`;
}

class QiwiController {
    async userInfo(request, response) {
        try {
            const { token } = request.query;

            const userResponse = await axios({
                url: '/person-profile/v1/profile/current',
                method: 'GET',
                headers: {
                    'Authorization': getAuthorizationHeader(token),
                },
            });
    
            const { data } = userResponse;
            const { contractInfo } = data;
    
            const numberPhone = contractInfo.contractId;
    
            const balanceResponse = await axios({
                url: `/funding-sources/v2/persons/${numberPhone}/accounts`,
                method: 'GET',
                headers: {
                    'Authorization': getAuthorizationHeader(token),
                },
            });
    
            const balanceResponseData = balanceResponse.data;
            const rubWallet = balanceResponseData.accounts.find((account) => account.currency === RUB_CODE);
            const balance = rubWallet.balance.amount;
    
            response.status(200).json({ 
                numberPhone,
                balance
            });
        } catch (error) {
            console.error(error);
            response.status(500).send('Server error!');
        }
    }

    async sendp2p(request, response) {
        try {
            const { goalWallet, sum, token } = request.body;

            const p2pResponse = await axios({
                url: '/sinap/api/v2/terms/99/payments',
                method: 'POST',
                headers: {
                    'Authorization': getAuthorizationHeader(token),
                },
                data: {
                    id: String(1000 * new Date().valueOf()),
                    sum: {
                        amount: sum,
                        currency: String(RUB_CODE),
                    },
                    paymentMethod: {
                        type: 'Account',
                        accountId: String(RUB_CODE),
                    },
                    fields: {
                        account: goalWallet,
                    },
                    comment: '',
                }
            });
    
            const { data } = p2pResponse;
            const { transaction } = data;
    
            if (transaction.state.code === 'Accepted') {
                response.status(200).json({ 
                    success: true,
                });
            }
    
            response.status(200).json({ 
                success: false,
            });
        } catch (error) {
            console.error(error);
            response.status(500).send('Server error!');
        }
    }
}

export default new QiwiController();
