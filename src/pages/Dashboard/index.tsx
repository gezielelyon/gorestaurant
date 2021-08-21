import React, { useEffect, useState } from 'react';

import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { IFoodProps } from '../../dtos';
import api from '../../services/api';

import { FoodsContainer } from './styles';

function Dashboard() {
  const [foods, setFoods] = useState<IFoodProps[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodProps>({} as IFoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/foods');

      setFoods(data);
    })();
  }, []);

  const handleAddFood = async (food: IFoodProps) => {
    try {
      const { data } = await api.post('/foods', {
        ...food,
        id: foods[foods.length - 1].id + 1,
        available: true,
      });

      setFoods((preState) => [...preState, data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: IFoodProps) => {
    try {
      const { data } = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((eachFood) =>
        eachFood.id !== data.id ? eachFood : data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: IFoodProps) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDeleteFood={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
