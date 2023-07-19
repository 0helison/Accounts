import chalk from  'chalk';
import inquirer from 'inquirer';
import fs from 'fs';

console.log(chalk.bgBlue.white('Bem vindo ao Accounts!!!'));

operation();
// lista de funcionalidades do sistema
function operation(){
    
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Que ação você quer realizar?',
        choices: 
        [
            'Criar Conta', 
            'Depositar', 
            'Sacar', 
            'Consultar Saldo', 
            'Sair' 
        ]
    }
]).then((answer) => {
    const action = answer['action'];

    if (action === 'Criar Conta'){
        createAccount();
    } else if (action === 'Depositar'){
        deposit();
    } else if (action === 'Sacar'){
        withdraw();
    } else if (action === 'Consultar Saldo'){
        getAccountBalance();
    } else if (action === 'Sair'){
        console.log(chalk.bgBlue.white('Obrigado por usar o Accounts!!!'));
        process.exit();
    }

}).catch(err => console.log(err));
}
// funcionalidade: criação de conta
function createAccount(){

    inquirer.prompt([{
        name: 'userName',
        message: 'Digite um nome de usuário para criar sua conta: '
    }
]).then((answer) => {
    const userName = answer['userName'];
    // criação do diretório onde estarão as contas a serem criadas
    if(!fs.existsSync('accounts')){
        fs.mkdirSync('accounts');
    }

    if (checkAccount(userName)){
        console.log(chalk.bgRed.white('Essa conta já existe, tente novamente!!!'));
        createAccount();
    } else {
        fs.writeFileSync(
            `accounts/${userName}.json`,
            JSON.stringify({balance: 0}),
            function(err){
                console.log(err);
            }
            )
        console.log(chalk.green(`A conta ${userName} foi criada com sucesso!!!`));
        operation();
    }

}).catch(err => console.log(err));
}
// etapa de validação da existência da conta
function checkAccount(userName){
    if(fs.existsSync(`accounts/${userName}.json`)){
        return true;
    } else {
        return false;
    }
}
// funcionalidade: depósito
function deposit(){

    inquirer.prompt([{
        name: 'userName',
        message: 'Em que conta você deseja realizar o depósito?'
    }
]).then((answer) => {
    const userName = answer['userName'];

    if(!checkAccount(userName)){
        console.log(chalk.bgRed.white('Essa conta não existe, tente novamente!!!'));
        deposit();
    } else {
        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja depositar ?'
        }
    ]).then((answer) => {
        const amount = answer['amount'];
        addAmount(userName, amount);
        operation();

    }).catch(err => console.log(err));
    }

}).catch(err => console.log(err));
}
// adição de montande vinculado a funcionalidade de depósito
function addAmount(userName, amount){
    const accountData = getAccount(userName);

    if(!amount){
        console.log(chalk.bgRed.white('Ocorreu um erro na sua solicitação, tente novamente!!!'));
        return;
    }

    accountData.balance = parseFloat(accountData.balance) + parseFloat(amount);

    fs.writeFileSync(`accounts/${userName}.json`,
    JSON.stringify(accountData),
    function(err) {
        console.log(err);
    }
    )
    console.log(chalk.green(`Foi depositado R$ ${amount} na conta ${userName}`));
}
// leitura dos dados da conta
function getAccount (userName){
    const accountJSON = fs.readFileSync(`accounts/${userName}.json`,
    {
        encoding: 'utf8',
        flag: 'r'
    })
    return JSON.parse(accountJSON);
}
// funcionalidade: saque
function withdraw(){

    inquirer.prompt([{
        name: 'userName',
        message: 'Em que conta você deseja realizar o saque?'
    }
]).then((answer) => {
    const userName = answer['userName'];

    if(!checkAccount(userName)){
        console.log(chalk.bgRed.white('Essa conta não existe, tente novamente!!!'));
        withdraw();
    } else {
        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja sacar ?'
        }
    ]).then((answer) => {
        const amount = answer['amount'];
        removeAmount(userName, amount);
        operation();

    }).catch(err => console.log(err));
    }
}).catch(err => console.log(err));
}
// remoção de montande vinculado a funcionalidade de saque
function removeAmount(userName, amount){
    const accountData = getAccount(userName);

    if(!amount){
        console.log(chalk.bgRed.white('Ocorreu um erro na sua solicitação, tente novamente!!!'));
        return;
    }

    if(accountData.balance <= amount){
        console.log(chalk.bgRed.white('Saldo insuficiente!!!'));
        return;
    } else{
        accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

    fs.writeFileSync(`accounts/${userName}.json`,
    JSON.stringify(accountData),
    function(err) {
        console.log(err);
    }
    )
    console.log(chalk.green(`Foi sacado R$ ${amount} na conta ${userName}`));
    }
}
// funcionalidade: consulta de saldo
function getAccountBalance(){
    inquirer.prompt([{
        name: 'userName',
        message: 'Em que conta você deseja consultar o saldo?'
    }
]).then((answer) => {
    const userName = answer['userName'];

    if(!checkAccount(userName)){
        console.log(chalk.bgRed.white('Essa conta não existe, tente novamente!!!'));
        getAccountBalance();
    } else {
        const accountData = getAccount(userName);
        console.log(chalk.green(`O saldo da conta ${userName} é de R${accountData.balance}`));
        operation();
    }
}).catch(err => console.log(err))
}