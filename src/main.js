import React, {Component} from 'react';
import  {
  Platform,
  AppState,
  Dimensions,
  BackHandler,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  TextInput
} from 'react-native';

import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError
} from 'react-native-iap';

const productIds = Platform.select({
  ios: [
    'com.storevue.iapdemo.coin10',
    'com.storevue.iapdemo.coin20'
  ],
  android: [
    'com.storevue.iapdemo.coin10',
    'com.storevue.iapdemo.coin20'
  ]
});
const permentProductIds = Platform.select({
  ios: [
    'com.storevue.iapdemo.adfree',
  ],
  android: [
    'com.storevue.iapdemo.adfree',
  ]
});

const subcriptionIds = Platform.select({
  ios: [
    'com.storevue.iapdemo.signage'
  ],
  android: [
    'com.storevue.iapdemo.signage'
  ]
});
class MainPage extends Component {
//  purchaseUpdateSubscription = null
//  purchaseErrorSubscription = null
  constructor(props) {
    super(props);
    this.purchaseUpdateSubscription = null
    this.purchaseErrorSubscription = null
    this.state = {
      products:[],subscriptions:[],permentProducts:[], user :'123',
      test:1,coins:0, noAd:false,orderMonth:false,
    }



  }
  async onPressProduct(p){
    const {user} =this.state;
    try {
      console.log("Request="+p.productId)
      await RNIap.requestPurchase(p.productId, false,user,user);
    } catch (err) {
      console.warn(err.code, err.message);
    }

  }
  renderProducts(){
    const {products} = this.state;
    var nodes = products.map(function(c,i){
        return <TouchableOpacity key={i}   onPress={()=>this.onPressProduct(c)}
                      style={{borderWidth:1,borderColor:'555',padding:10,margin:3}}>
                    <Text>{c.description}</Text>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{marginRight:5}}>{c.currency}</Text>
                      <Text>{c.price}</Text>
                    </View>
              </TouchableOpacity>
    }.bind(this))
    return nodes;

  }

  renderPermentProducts(){
    const {permentProducts,adFree} = this.state;
    var nodes = permentProducts.map(function(c,i){
        console.log( "Is AD Free"+adFree)
        if( c.productId ==  'com.storevue.iapdemo.adfree' && adFree){
          return <View key={i}
                        style={{borderWidth:1,borderColor:'555',padding:10,margin:3,backgroundColor:'#CCC'}}>
                      <Text>{c.description}</Text>
                      <View style={{flexDirection:'row'}}>
                        <Text>{'已購買'}</Text>
                      </View>
                </View>
        }else{
          return <TouchableOpacity key={i}   onPress={()=>this.onPressProduct(c)}
                        style={{borderWidth:1,borderColor:'555',padding:10,margin:3}}>
                      <Text>{c.description}</Text>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{marginRight:5}}>{c.currency}</Text>
                        <Text>{c.price}</Text>
                      </View>
                </TouchableOpacity>
        }

    }.bind(this))
    return nodes;

  }
  renderSubscriptions(){
    const {subscriptions,isMonth} = this.state;
    var nodes = subscriptions.map(function(c,i){
  
        if( c.productId ==  'com.storevue.iapdemo.signage' && isMonth){
          return <View key={i}
                        style={{borderWidth:1,borderColor:'555',padding:10,margin:3,backgroundColor:'#CCC'}}>
                      <Text>{c.description}</Text>
                      <View style={{flexDirection:'row'}}>
                        <Text>{'已購買'}</Text>
                      </View>
                </View>
        }else{
          return <TouchableOpacity key={i}   onPress={()=>this.onPressProduct(c)}
                        style={{borderWidth:1,borderColor:'555',padding:10,margin:3}}>
                      <Text>{c.description}</Text>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{marginRight:5}}>{c.currency}</Text>
                        <Text>{c.price}</Text>
                      </View>
                </TouchableOpacity>
        }

    }.bind(this))
    return nodes;

  }
  onPressUpdate(){
     this.getPurchase();
  }
  render(){
    const {user} = this.state;
    return (<View>
              <Text style={{marginBottom:10}}>{"使用者"}</Text>
              <View style={{flexDirection:'row'}} >
                <TextInput
                    style={{height: 40, flex:1,borderWidth:1,borderColor:"#000"}}
                    placeholder=""
                    onChangeText={user => this.setState({user})}
                    value={user}
                />
                <TouchableOpacity  onPress={()=>this.onPressUpdate()}
                              style={{width:100,backgroundColor:"#CCC",
                              borderWidth:1,borderColor:"#000",justifyContent:'center',alignItems:"center"}}>
                            <Text>{"Update"}</Text>
                      </TouchableOpacity>
              </View>
              <Text style={{marginBottom:10,marginTop:10}}>{"可重覆購買項目 已購買數量="+this.state.coins}</Text>
              {this.renderProducts()}
              <Text style={{marginBottom:10,marginTop:10}}>{"一次性購買項目"}</Text>
              {this.renderPermentProducts()}
              <Text style={{marginTop:10,marginBottom:10}}>可訂閱項目</Text>
              {this.renderSubscriptions()}
            </View>);
  }


  componentWillUnmount() {
      console.log('componentWillUnmoun')

  }
  async getPurchase(){
    const {user} = this.state;
    try {
         const purchases = await RNIap.getAvailablePurchases();
         var isMonth = false;
         var adFree = false;
         let restoredTitles = [];
         console.log("Get Availabel Purchase")
         console.log(purchases)
         var coins = this.state.coins;
         purchases.forEach(purchase => {
           if(purchase.obfuscatedAccountIdAndroid == user){
             switch (purchase.productId) {
             case 'com.storevue.iapdemo.signage':
               isMonth = true;
               break

             case 'com.storevue.iapdemo.adfree':
               adFree = true;
               break

             case 'com.storevue.iapdemo.coin10':
              coins+=10;
              RNIap.consumePurchaseAndroid(purchase.purchaseToken);
              break;
             case 'com.storevue.iapdemo.coin20':
               coins+=20;
               RNIap.consumePurchaseAndroid(purchase.purchaseToken);
               break;
            //   await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
            //   CoinStore.addCoins(100);
             }
           }

         })
         this.setState({coins,isMonth,adFree})

        // Alert.alert('Restore Successful', 'You successfully restored the following purchases: ' + restoredTitles.join(', '));
       } catch(err) {
         console.warn(err); // standardized err.code and err.message available
         Alert.alert(err.message);
       }

  }

 requestSubscription = async (sku: string) => {
   try {
     await RNIap.requestSubscription(sku);
   } catch (err) {
     console.warn(err.code, err.message);
   }
 }
 async updateListener(purchase){
     console.log('purchaseUpdatedListener', purchase);
     const receipt = purchase.transactionReceipt;
     console.log("Receipt")
     console.log(receipt)
     this.getPurchase();
     /*
     if (receipt) {

          if (Platform.OS === 'ios') {
             await  RNIap.finishTransactionIOS(purchase.transactionId);
           } else if (Platform.OS === 'android') {
             // If consumable (can be purchased again)
             await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
             // If not consumable
             await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
           }

           // From react-native-iap@4.1.0 you can simplify above `method`. Try to wrap the statement with `try` and `catch` to also grab the `error` message.
           // If consumable (can be purchased again)
           await  RNIap.finishTransaction(purchase, true);
           // If not consumable
           await RNIap.finishTransaction(purchase, false);
         } else {
           // Retry / conclude the purchase is fraudulent, etc...
   }
   */
    this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
     console.warn('purchaseErrorListener', error);
   });

 }

  async componentDidMount() {
    /*
    try {
      var res = await RNIap.initConnection();
      console.log(res)
    } catch(err) {
   }
   */
   try {
     const products: Product[] = await RNIap.getProducts(productIds);
     console.log(products)
     this.setState({ products });
   } catch(err) {
   }
     try {
       const permentProducts: Product[] = await RNIap.getProducts(permentProductIds);
       console.log(permentProducts)
       this.setState({ permentProducts});
     } catch(err) {

   }
   try {
     const subscriptions: Product[] = await RNIap.getSubscriptions(subcriptionIds);
     console.log(subscriptions)
     this.setState({ subscriptions });
   } catch(err) {
     console.warn(err); // standardized err.code and err.message available


   }
   console.log("Init connection")
   await RNIap.initConnection();

   this.purchaseUpdateSubscription = purchaseUpdatedListener((purchase: InAppPurchase | SubscriptionPurchase | ProductPurchase ) =>
    { this.updateListener(purchase)  })
  this.getPurchase();
   //this.getPurchase();
  /*
   RNIap.initConnection().then(() => {
     RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch(() => {}).then(() => {
       this.purchaseUpdateSubscription = purchaseUpdatedListener((purchase: InAppPurchase | SubscriptionPurchase | ProductPurchase ) =>
        { this.updateListener(purchase)  })
      })
   });
   */

 }


}
export default MainPage;
