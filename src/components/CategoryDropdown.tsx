import { View, Text } from 'react-native'
// import React from 'react'
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Select from './Select';
import { Dispatch, SetStateAction } from 'react';

const CategoryDropdown = ({category, setCategory, label, resultDisabled, identifier="name"}: {category: string; setCategory: Dispatch<SetStateAction<string>>; label?: string; resultDisabled?: boolean; identifier?: string}) => {
    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("categories");
      return res.data;
    },
  });

  return (
    <View>
      <Select value={category} setValue={setCategory} data={categoriesData} label={label} identifier={identifier} defaultLabel='All Categories' resultDisabled={resultDisabled} />
    </View>
  )
}

export default CategoryDropdown