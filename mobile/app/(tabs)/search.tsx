import { View, Text, TextInput, ScrollView, Pressable, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';

type TrendingTopic = {
  topic: string;
  tweets: string;
};

const fetchTrending = async (): Promise<TrendingTopic[]> => {
  const res = await fetch('https://x-y-ss74.onrender.com/api/trending');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const searchScreens = () => {
  const { data, isLoading, refetch, isRefetching } = useQuery<TrendingTopic[]>({
    queryKey: ['trending'],
    queryFn: fetchTrending,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const [search, setSearch] = useState('');
  const filteredData = data?.filter((item) =>
    item.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* HEADER */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#6577786" />
          <TextInput
            placeholder="Search Buddy"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#6969"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">🔥Trendings for you</Text>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : filteredData && filteredData.length > 0 ? (
            filteredData.map((item: TrendingTopic, index: number) => (
              <Pressable key={index} className="py-3">
                <Text className="text-gray-700 text-sm">Trending in Technologia</Text>
                <Text className=" font-bold text-blue-500 text-lg">{item.topic}</Text>
                <Text className="text-gray-700 text-sm">{item.tweets} Tweets</Text>
              </Pressable>
            ))
          ) : (
            <Text>
              No trending topics found!{"\n"}{"\n"}
              "Take some steps in life, looser" ~CaseOh
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default searchScreens;