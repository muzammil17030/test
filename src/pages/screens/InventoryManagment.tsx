import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, remove, update } from 'firebase/database';
import styled from 'styled-components';

const firebaseConfig = {
  apiKey: "AIzaSyBCRlaLVUuCvPCpu1Np-K9vnrInzLMrxek",
  authDomain: "react-test-ed722.firebaseapp.com",
  databaseURL: "https://react-test-ed722-default-rtdb.firebaseio.com",
  projectId: "react-test-ed722",
  storageBucket: "react-test-ed722.appspot.com",
  messagingSenderId: "1032537159804",
  appId: "1:1032537159804:web:ec1b14a202238094d5b1f9",
  measurementId: "G-1WXFTY2K5T"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: 0, price: 0 });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const inventoryRef = ref(database, 'inventory');
    onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsList = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<InventoryItem, 'id'>),
        }));
        setItems(itemsList);
      } else {
        setItems([]);
      }
    });
  }, []);

  const addItem = () => {
    const inventoryRef = ref(database, 'inventory');
    push(inventoryRef, newItem);
    setNewItem({ name: '', quantity: 0, price: 0 });
  };

  const deleteItem = (id: string) => {
    const itemRef = ref(database, `inventory/${id}`);
    remove(itemRef);
  };

  const startEditing = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const saveEdit = () => {
    if (editingItem) {
      const itemRef = ref(database, `inventory/${editingItem.id}`);
      update(itemRef, { name: editingItem.name, quantity: editingItem.quantity, price: editingItem.price });
      setEditingItem(null);
    }
  };

  const showDetails = (item: InventoryItem) => {
    setDetailItem(item);
  };

  return (
    <Container>
      <h1>Inventory Management</h1>
      <Form>
        <input
          type="text"
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
        />
        <Button onClick={addItem}>Add Item</Button>
      </Form>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{editingItem?.id === item.id ? 
                <input 
                  value={editingItem.name} 
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                /> : item.name}
              </td>
              <td>{editingItem?.id === item.id ? 
                <input 
                  type="number" 
                  value={editingItem.quantity} 
                  onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value)})}
                /> : item.quantity}
              </td>
              <td>{editingItem?.id === item.id ? 
                <input 
                  type="number" 
                  value={editingItem.price} 
                  onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                /> : `$${item.price.toFixed(2)}`}
              </td>
              <td>
                {editingItem?.id === item.id ? (
                  <Button onClick={saveEdit}>Save</Button>
                ) : (
                  <Button onClick={() => startEditing(item)}>Edit</Button>
                )}
                <Button onClick={() => deleteItem(item.id)}>Delete</Button>
                <Button onClick={() => showDetails(item)}>Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {detailItem && (
        <Modal>
          <h2>Item Details</h2>
          <p>Name: {detailItem.name}</p>
          <p>Quantity: {detailItem.quantity}</p>
          <p>Price: ${detailItem.price.toFixed(2)}</p>
          <Button onClick={() => setDetailItem(null)}>Close</Button>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  background-color:lightgrey;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    }
    `;
    
    const Table = styled.table`
    background-color:skyblue;
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 8px;
      border: 1px solid #ccc;
      text-align: left;
      }
      
      th {
        background-color: #f0f0f0;
        }
        `;
        
        const Button = styled.button`
        padding: 8px 18px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-left:3px;
        
        &:hover {
          background-color: #0056b3;
          }
          `;
          
          const Modal = styled.div`
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          `;
          
          export default Inventory;