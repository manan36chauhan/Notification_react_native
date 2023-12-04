import firestore from "@react-native-firebase/firestore";

import React, { useContext, useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Clipboard,
  ToastAndroid,
  AlertIOS,
  Permission,
} from "react-native";
import { styles } from "../Notification/styles";
//Context
//Components
import { ApplicationStyles, Fonts } from "../../Themes";
import { ArrowLeft } from "../../Themes/Svg";
//Library
import { ScaledSheet } from "react-native-size-matters";
import { useTheme } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import MultilineHeader from "../../ComponentReuse/MultilineHeader";
const { poppins_bold_16 } = Fonts.style;
import { Firestore } from "@react-native-firebase/firestore";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { notificationWatcher } from "../../redux/action/homeAction";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import { NotificationLoader } from "../../ComponentReuse/Shimmer";
import MyContext from "../../Context/MyContext";
import {
  ImageComp,
  LineBorder,
  LinedTextComp,
  TextComp,
} from "../../ComponentReuse/TextUIBased";

const Notifications = (props) => {
  const { colors } = useTheme();
  const theme = useTheme();
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const [loader, setLoader] = useState(true);
  const [productloader, setProductLoader] = useState(false);
  const [fdata, setfData] = useState([]);
  const navigation = useNavigation();
  const [isRead, setisRead] = useState(false);
  const [visible, setVisible] = useState(false);
  const { language } = useContext(MyContext);

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const { poppins_medium_16 } = Fonts.style;

  const copyToClipboard = (item) => {
    console.log("---------selected item------------", item);
    if (item.notification_type == "Offers") {
      Clipboard.setString(item.coupon_code_name);
      //showToast();
      onToggleSnackBar(item.id);
      console.log("---->>coupon_code_name", item.coupon_code_name);
    } else if (item.notification_type == "Product") {
      // act();
      setProductLoader(true)
      dispatch(
        notificationWatcher(
          item.id,
          async (res) => {
            console.log("----------------res-----------------", res);
      setProductLoader(false)

            props.navigation.navigate("Customization", {
              item: res[0],
            });
          },
          (error) => {
      setProductLoader(false)

            console.log("----------------error-----------------", error);
          }
        )
      );

      // navigation.navigate("Customization", {
      //   item: item,
      // });
    }
  };

  const dispatch = useDispatch();

  const renderItem = ({ item }) => (
    <>
      <TouchableOpacity onPress={() => copyToClipboard(item)}>
        <View style={styles.listItem}>
          <View style={isRead ? styles.bulletread : styles.bullet} />
          <View style={styles.listItemView}>
            <Text style={[styles.title]}>
              {item.title}
              {item.coupon_code_name != "-"
                ? ': "' + item.coupon_code_name + '"'
                : null}
            </Text>
            <Text style={styles.message}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );

  const colorStyles = ScaledSheet.create({
    screenBg: { backgroundColor: colors.white },
    primaryHighlight: { color: colors.primaryHighlight },
    primaryText: { color: colors.primaryText },
  });

  useEffect(() => {
    setisRead(true);

    const fetchData = async () => {
      setLoader(true);
      console.log("-------- start-----");
      dispatch(
        notificationWatcher(
          "",
          async (res) => {
            setTimeout(() => {
              setLoader(false);
            }, 4000);
            console.log("-------res----", res);
            setfData(res);
          },
          (error) => {
            setLoader(false);
            console.log("-----error-----", error);
          }
        )
      );
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MultilineHeader navigation={props.navigation} title={"Notification"} />
      ),
      headerLeft: () => (
        <>
          <TouchableOpacity
            style={ApplicationStyles.headerBackArrow}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <ArrowLeft color={colors.text} backgroundColor={colors.black} />
          </TouchableOpacity>
        </>
      ),
    });
  }, [props.navigation, theme]);

  if (loading) {
    return (
      <>
        {loader == true ? (
          <NotificationLoader />
        ) : (
          <View style={[styles.body]}>
            <FlatList
              data={fdata}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          style={styles.snackbar}
          duration={2000}
        >
          <Text style={styles.snackbarText}>Code Copied.</Text>
        </Snackbar>

{productloader ? (<View style={styles.absoluteLoader}>
          <ActivityIndicator size={"small"} color={colors.black} />
          <TextComp
            text={language.redirectToCustomize}
            style={[
              poppins_medium_16,
              colorStyles.primaryText,
              styles.loaderText,
            ]}
          />
        </View>) : null}
        
      </>
    );
    //<ActivityIndicator />;
  }
};

export default Notifications;
