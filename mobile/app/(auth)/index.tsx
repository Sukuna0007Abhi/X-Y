import { useSocialAuth } from "@/hooks/useSocialAuth";
import { ActivityIndicator, Image,Text,TouchableOpacity,View } from "react-native";

export default function Index() {
  const { isLoading, handleSocialAuth } = useSocialAuth();  
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between">
        <View className="flex-1 justify-center">
      {/* DEMO IMAGE */}
      <View className="items-center">
        <Image 
          source={require("../../assets/images/auth-demo.png")}
          className="size-96 ml-7"
          resizeMode="contain"
        />
      </View>
      <View className="flex-col gap-4 ml-1 mb-120 -mt-14">
        {/* GOOGLE SIGNIN BTN */}

      <TouchableOpacity
        className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
        onPress={() => {
          handleSocialAuth("oauth_google");
        }}
        disabled={isLoading}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2, 
        }}
      >
            {isLoading ? (
                  <ActivityIndicator size="small" color="#4285F4" />
                ) : (
              <View className="flex-row items-center justify-center">
                <Image 
                  source={require("../../assets/images/google.png")}
                  className="size-12 mr-1"
                  resizeMode="contain"
                />
                <Text className="text-black font-medium text-base">Continue with Google</Text>
              </View>
        )}
      </TouchableOpacity>

        {/* APPLE SIGNIN BTN */}

      <TouchableOpacity
        className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
        onPress={() => {
          handleSocialAuth("oauth_apple");
        }}
        disabled={isLoading}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2, 
        }}
      >
            {isLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (  
              <View className="flex-row items-center justify-center">
                <Image 
                  source={require("../../assets/images/apple.png")}
                  className="size-9 mr-3 mb-3"
                  resizeMode="contain"
                />
                <Text className="text-black font-medium text-base">Continue with Apple</Text>
              </View>
            )}
      </TouchableOpacity>
            </View>
            {/* Terms and Privacy */}
          <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
            By signing up, you agree to our <Text className="text-blue-500">Terms</Text>
            {", "}
            <Text className="text-blue-500">Privacy Policy</Text>
            {", and "}
            <Text className="text-blue-500">Cookies</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}

