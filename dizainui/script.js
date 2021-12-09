App = 
{
  contracts: {},
  loading: false,  //kad zinotume ar jau nekrauna puslapio (t.y. kad neuzkrautume du kartus puslapio)
    load: async() =>
    {
        await App.loadWeb3();
        await App.pridekAccounta();
        await App.pridekKontrakta();
        await App.render();
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

      pridekAccounta: async() =>
      {
        web3.eth.getAccounts().then(function(result){
          App.account = result[0];
        })
      },

      pridekKontrakta: async() =>
      {
        const uzsakymai = await $.getJSON('Uzsakymai.json');
        console.log(uzsakymai);
        App.contracts.Uzsakymai = TruffleContract(uzsakymai);
        App.contracts.Uzsakymai.setProvider(App.web3Provider);
        App.uzsakymai = await App.contracts.Uzsakymai.deployed();
      },

      render: async() =>
      {
        if(App.loading == true) return;

        App.setLoading(true);
        $('#account').html(App.account);
        await App.renderTask();
        App.setLoading(false);
      },

      renderTask: async() =>
      {
        const UzsakymuSk = await App.uzsakymai.UzsakymuSk();
        const $taskTemplate = $('.taskTemplate');
        for(var i = 1; i <= UzsakymuSk; i++)
        {
          const uzsakymas = await App.uzsakymai.visiUzsakymai(i);
          const uzsakymoUzbaigimas = uzsakymas[0];
          const uzsakymoId = uzsakymas[1].toNumber();
          const uzsakymoTekstas = uzsakymas[2];
        
          const $naujasTemplate = $taskTemplate.clone();
          $naujasTemplate.find('.content').html(uzsakymoTekstas);
          $naujasTemplate.find('input').prop('name', uzsakymoId).prop('checked', uzsakymoUzbaigimas).on('click', App.uzbaikUzsakyma);
          if(uzsakymoUzbaigimas == true)
          {
            $('#uzbaigtiUzsakymai').append($naujasTemplate);
          }
          else
          {
            $('#uzsakymuSarasas').append($naujasTemplate);
          }
          $naujasTemplate.show();
        }
      },

      sukurkUzsakyma: async() =>
      {
        const iterpimas = $('#naujasUzsakymas').val();
        await App.uzsakymai.SukurkUzsakyma(iterpimas, {from: App.account});
        window.location.reload(); //refreshinam
      },

      //passinam pati eventa funkcijai
      uzbaikUzsakyma: async(eventas) =>
      {
        const uzsakymoId = eventas.target.name; //kiekvienas uzsakymas html kode turi reiksme name, kuri veikia kaip id
        await App.uzsakymai.UzbaikUzsakyma(uzsakymoId, {from: App.account});
        window.location.reload(); //refreshinam
      },

      setLoading: (reiksme) =>
      {
        App.loading = reiksme;
        const loader = $('#loader');
        const content = $('#content');
        if(reiksme) //jei loadina, tai paslepiam turini, rodom, kad krauna
        {
          loader.show();
          content.hide();
        }
        else //jei neloadina, tai paslepiam teksta, kad krauna ir rodom turini
        {
          content.show();
          loader.hide();
        }
      }
}



$(() =>
{
    $(window).load(() =>
    {
        App.load();
    })
})