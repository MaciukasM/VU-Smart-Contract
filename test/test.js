const { assert } = require("chai");

//const { artifacts } = require("truffle");
const Uzsakymai = artifacts.require("./Uzsakymai.sol");

contract ('Uzsakymai', (acc) =>
{
    //pries kiekvienam testui prasidedant passinam funkcija
    before(async() => 
    {
        this.uzsakymai = await Uzsakymai.deployed();
    })

    //patys testai
    it('deployinimo testavimas', async () => 
    {
        const address = await this.uzsakymai.address;
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
    })
    it('uzsakymu isvardinimo testavimas', async () =>
    {
        const uzsakymuSk = await this.uzsakymai.UzsakymuSk();
        const uzsakymas = await this.uzsakymai.visiUzsakymai(uzsakymuSk);
        assert.equal(uzsakymas.id.toNumber(), uzsakymuSk.toNumber());
        assert.equal(uzsakymas.ArUzbaigta, false);
        assert.equal(uzsakymuSk.toNumber(), 1);
        assert.equal(uzsakymas.tekstas, 'Sriuba');
    })
    it('uzsakymu kurimo testavimas', async() =>
    {
        const uzsakymuSk1 = await this.uzsakymai.UzsakymuSk();
        const naujasUzsakymas = await this.uzsakymai.SukurkUzsakyma('Testinis uzsakymas');

        const uzsakymuSk = await this.uzsakymai.UzsakymuSk();
        assert.equal(uzsakymuSk.toNumber(), uzsakymuSk1.toNumber()+1);

        //console.log(naujasUzsakymas); //jei norim paziuret informacija apie sukurta uzsakyma

        const info = naujasUzsakymas.logs[0].args;
        assert.equal(info.ArUzbaigta, false);
        assert.equal(info.id.toNumber(), 2);
        assert.equal(info.tekstas, 'Testinis uzsakymas');
    })
    it('uzsakymu statuso pakeitimo testavimas', async() =>
    {
        const pakeistasStatusas = await this.uzsakymai.UzbaikUzsakyma(1);
        const uzsakymas = await this.uzsakymai.visiUzsakymai(1);

        assert.equal(uzsakymas.ArUzbaigta, true);

        const info = pakeistasStatusas.logs[0].args;

        assert.equal(info.ArUzbaigta, true);
        assert.equal(info.id.toNumber(), 1);
    })
})