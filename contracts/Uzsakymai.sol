// SPDX-License-Identifier: MIT

//nurodom versija
pragma solidity >=0.4.22 <0.9.0;

//pats kontraktas
contract Uzsakymai
{
    //apsirasom struktura uzsakymams
    struct Uzsakymas
    {
        //bool kintamasis, parodantis ar uzsakymas uzbaigtas
        bool ArUzbaigta;

        //id kintamasis
        uint id;
        //uzsakymo aprasas
        string tekstas;
    }

    //kuriam kintamuju poras uzsakymams
    mapping(uint => Uzsakymas) public visiUzsakymai;

    //visu uzsakymu kiekis
    uint public UzsakymuSk = 0;

    //sukuriam funkcija uzsakymu kurimui
    function SukurkUzsakyma(string memory _tekstas) public
    {
        //pakeiciam uzsakymu skaiciu
        UzsakymuSk++;
        //sukuriam nauja uzsakyma masyve
        visiUzsakymai[UzsakymuSk] = Uzsakymas(false, UzsakymuSk, _tekstas);
        
        //triggerinam sukurto uzsakymo event'a
        emit SukurtasUzsakymas(false, UzsakymuSk, _tekstas);
    }

    function UzbaikUzsakyma(uint _id) public
    {
        Uzsakymas memory _uzs1 = visiUzsakymai[_id]; //surandam reikiama uzsakyma
        _uzs1.ArUzbaigta = !_uzs1.ArUzbaigta; //apkeiciam bool reiksme
        visiUzsakymai[_id] = _uzs1; //ir vel idedam i uzsakymu masyva

        //kaip ir uzsakymo sukurimo funkcijoj, triggerinam eventa
        emit UzbaigtasUzsakymas(_uzs1.ArUzbaigta, _id);
    }

    constructor() 
    {
        SukurkUzsakyma("Sriuba");
    }

    //is esmes nukopijuoti duomenys is strukturos - su eventu zinosim, ar jau sukurtas yra uzsakymas, kad galetume ji atvaizduoti client-side
    event SukurtasUzsakymas
    (
        bool ArUzbaigta,

        uint id,
        string tekstas
    );

    //lygiai tas pats ir su uzbaigimo eventu, kaip su sukurimo (tik uzsakymo teksto mums nereikia)
    event UzbaigtasUzsakymas
    (
        bool ArUzbaigta,

        uint id
    );
}