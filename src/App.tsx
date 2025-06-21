import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr;
  gap: 20px;
  height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ImageSection = styled.div`
  grid-row: 1;
  grid-column: 1;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 40px);
  position: sticky;
  top: 20px;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const SidePanel = styled.div`
  grid-row: 1;
  grid-column: 2;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 20px;
  height: calc(100vh - 40px);
  position: sticky;
  top: 20px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const AnnotatedList = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const InstructionsSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

const UserInputSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const CurrentItem = styled.div`
  background-color: #e3f2fd;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 3px solid #2196f3;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.2);
  transform: scale(1.02);
  transition: all 0.2s ease-in-out;
`;

const CurrentItemTitle = styled.h4`
  color: #000000;
  margin: 0 0 15px 0;
  font-size: 1.2em;
  font-weight: 600;
`;

const CurrentItemContent = styled.div`
  font-size: 1.4em;
  font-weight: 700;
  color: #000000;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
`;

const TilePage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const SelectionContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const SelectContainer = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
`;

const StartButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 1.1em;
  margin-top: 20px;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

interface Component {
  name: string;
  size?: 'Very Large' | 'Large' | 'Medium' | 'Small' | 'Very Small';
  frequency?: 'Constant' | 'Frequent' | 'Occasional' | 'Rare' | 'Emergency';
  landmarks?: string[]; // Array of 3 landmark component names
}

interface ProximityEntry {
  target: string;
  proximity: string;
}

interface SpatialEntry {
  target: string;
  spatialRelation: string;
}

interface LegendItem {
  id: number;
  text: string;
  size: string;
  frequency: string;
  landmarks: string;
  relationships: {
    target: string;
    proximity: string;
    significance: number;
    position: string;
    landmark: boolean;
  }[];
}

// Add interface for last action
interface LastAction {
  type: 'size' | 'frequency' | 'proximity' | 'spatial' | 'landmark';
  component: string;
  target?: string;
  value: string | string[];
  previousValue?: string | string[];
}

function App() {
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
  const [labeledComponents, setLabeledComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [selectedDistance, setSelectedDistance] = useState<string>('');
  const [selectedSpatial, setSelectedSpatial] = useState<string>('');
  const [selectedLandmark, setSelectedLandmark] = useState<string>('');
  const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>([]);
  const [sizeComponentIndex, setSizeComponentIndex] = useState(0);
  const [frequencyComponentIndex, setFrequencyComponentIndex] = useState(0);
  const [landmarkComponentIndex, setLandmarkComponentIndex] = useState(0);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(1);
  const [componentSizes, setComponentSizes] = useState<Record<string, string>>({});
  const [componentFrequencies, setComponentFrequencies] = useState<Record<string, string>>({});
  const [componentLandmarks, setComponentLandmarks] = useState<Record<string, string[]>>({});
  const [componentProximities, setComponentProximities] = useState<Record<string, ProximityEntry[]>>({});
  const [spatialSourceIndex, setSpatialSourceIndex] = useState(0);
  const [spatialTargetIndex, setSpatialTargetIndex] = useState(1);
  const [componentSpatialRelations, setComponentSpatialRelations] = useState<Record<string, SpatialEntry[]>>({});
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  
  useEffect(() => {
    // Load labeled components from JSON file
    fetch('/annotation-tool/legend_components_1.json')
      .then(response => response.json())
      .then(data => {
        // Handle both formats - Acura format (array) and legend_components format (object with components array)
        const componentsArray = Array.isArray(data) ? data : (data.components || []);
        
        if (componentsArray.length > 0) {
          const components = componentsArray.map((name: string) => ({ name }));
          setLabeledComponents(components);
          // Initialize size and frequency objects with empty values
          const initialSizes: Record<string, string> = {};
          const initialFrequencies: Record<string, string> = {};
          const initialLandmarks: Record<string, string[]> = {};
          const initialProximities: Record<string, ProximityEntry[]> = {};
          const initialSpatialRelations: Record<string, SpatialEntry[]> = {};
          components.forEach((comp: Component) => {
            initialSizes[comp.name] = '';
            initialFrequencies[comp.name] = '';
            initialLandmarks[comp.name] = [];
            initialProximities[comp.name] = [];
            initialSpatialRelations[comp.name] = [];
          });
          setComponentSizes(initialSizes);
          setComponentFrequencies(initialFrequencies);
          setComponentLandmarks(initialLandmarks);
          setComponentProximities(initialProximities);
          setComponentSpatialRelations(initialSpatialRelations);

          // Set the first component as selected for both stages
          if (components.length > 0) {
            setSelectedComponent(components[0].name);
          }
        } else {
          console.error('Invalid JSON data format or empty components array');
        }
      })
      .catch(error => console.error('Error loading labeled components:', error));
  }, []);

  useEffect(() => {
    // Load available brands from the dataset directory
    fetch('/annotation-tool/Dataset/brands.json')
      .then(response => response.json())
      .then(data => {
        console.log('Loaded brands:', data);
        setBrands(data);
      })
      .catch(error => {
        console.error('Error loading brands:', error);
        // Fallback to hardcoded brands if fetch fails
        setBrands(['Acura', 'Subaru', 'Lexus']);
      });
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      console.log('Loading models for brand:', selectedBrand);
      const modelPath = `/annotation-tool/Dataset/${selectedBrand}/models.json`;
      console.log('Attempting to fetch from path:', modelPath);
      
      // Load available models for the selected brand - using exact case as in directory
      fetch(modelPath)
        .then(response => {
          console.log('Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Successfully loaded models:', data);
          if (Array.isArray(data)) {
            setModels(data);
            console.log('Models state updated with:', data);
          } else {
            console.error('Loaded data is not an array:', data);
            setModels([]);
          }
          setSelectedModel(''); // Reset model selection when brand changes
        })
        .catch(error => {
          console.error('Error loading models for', selectedBrand, ':', error);
          setModels([]);
        });
    } else {
      setModels([]);
    }
  }, [selectedBrand]);

  const allComponents = labeledComponents;

  const getNextSizeComponent = () => {
    if (sizeComponentIndex < allComponents.length - 1) {
      setSizeComponentIndex(sizeComponentIndex + 1);
      setSelectedComponent(allComponents[sizeComponentIndex + 1].name);
      setSelectedSize('');
    }
  };

  const getNextFrequencyComponent = () => {
    if (frequencyComponentIndex < allComponents.length - 1) {
      setFrequencyComponentIndex(frequencyComponentIndex + 1);
      setSelectedComponent(allComponents[frequencyComponentIndex + 1].name);
      setSelectedFrequency('');
    }
  };

  const handleUndo = () => {
    if (!lastAction) return;

    switch (lastAction.type) {
      case 'size':
        setComponentSizes(prev => ({
          ...prev,
          [lastAction.component]: (lastAction.previousValue as string) || ''
        }));
        setLabeledComponents(prevComponents => 
          prevComponents.map(c => 
            c.name === lastAction.component ? { ...c, size: (lastAction.previousValue as Component['size']) } : c
          )
        );
        // Update size component index to allow re-annotation
        const sizeIndex = allComponents.findIndex(c => c.name === lastAction.component);
        if (sizeIndex !== -1) {
          setSizeComponentIndex(sizeIndex);
          setSelectedComponent(allComponents[sizeIndex].name);
          setSelectedSize('');
        }
        break;

      case 'frequency':
        setComponentFrequencies(prev => ({
          ...prev,
          [lastAction.component]: (lastAction.previousValue as string) || ''
        }));
        setLabeledComponents(prevComponents => 
          prevComponents.map(c => 
            c.name === lastAction.component ? { ...c, frequency: (lastAction.previousValue as Component['frequency']) } : c
          )
        );
        // Update frequency component index to allow re-annotation
        const freqIndex = allComponents.findIndex(c => c.name === lastAction.component);
        if (freqIndex !== -1) {
          setFrequencyComponentIndex(freqIndex);
          setSelectedComponent(allComponents[freqIndex].name);
          setSelectedFrequency('');
        }
        break;

      case 'proximity':
        if (lastAction.target && lastAction.component) {
          setComponentProximities(prev => {
            const newProximities = { ...prev };
            const component = lastAction.component as string;
            const target = lastAction.target as string;
            
            if (component in newProximities) {
              newProximities[component] = newProximities[component].filter(
                (entry: ProximityEntry) => entry.target !== target
              );
            }
            if (target in newProximities) {
              newProximities[target] = newProximities[target].filter(
                (entry: ProximityEntry) => entry.target !== component
              );
            }
            return newProximities;
          });
          // Update proximity indices to allow re-annotation
          const sourceIndex = allComponents.findIndex(c => c.name === lastAction.component);
          const targetIndex = allComponents.findIndex(c => c.name === lastAction.target);
          if (sourceIndex !== -1 && targetIndex !== -1) {
            setCurrentSourceIndex(sourceIndex);
            setCurrentTargetIndex(targetIndex);
            setSelectedComponent(allComponents[sourceIndex].name);
            setSelectedTarget(allComponents[targetIndex].name);
            setSelectedDistance('');
          }
        }
        break;

      case 'spatial':
        if (lastAction.target && lastAction.component) {
          setComponentSpatialRelations(prev => {
            const newRelations = { ...prev };
            const component = lastAction.component as string;
            const target = lastAction.target as string;
            
            if (component in newRelations) {
              newRelations[component] = newRelations[component].filter(
                (entry: SpatialEntry) => entry.target !== target
              );
            }
            if (target in newRelations) {
              newRelations[target] = newRelations[target].filter(
                (entry: SpatialEntry) => entry.target !== component
              );
            }
            return newRelations;
          });
          // Update spatial indices to allow re-annotation
          const spatialSourceIndex = allComponents.findIndex(c => c.name === lastAction.component);
          const spatialTargetIndex = allComponents.findIndex(c => c.name === lastAction.target);
          if (spatialSourceIndex !== -1 && spatialTargetIndex !== -1) {
            setSpatialSourceIndex(spatialSourceIndex);
            setSpatialTargetIndex(spatialTargetIndex);
            setSelectedComponent(allComponents[spatialSourceIndex].name);
            setSelectedTarget(allComponents[spatialTargetIndex].name);
            setSelectedSpatial('');
          }
        }
        break;

      case 'landmark':
        setComponentLandmarks(prev => ({
          ...prev,
          [lastAction.component]: (lastAction.previousValue as string[]) || []
        }));
        setLabeledComponents(prevComponents => 
          prevComponents.map(c => 
            c.name === lastAction.component ? { ...c, landmarks: (lastAction.previousValue as string[]) || [] } : c
          )
        );
        // Update landmark component index to allow re-annotation
        const landmarkIndex = allComponents.findIndex(c => c.name === lastAction.component);
        if (landmarkIndex !== -1) {
          setLandmarkComponentIndex(landmarkIndex);
          setSelectedComponent(allComponents[landmarkIndex].name);
          setSelectedLandmarks((lastAction.previousValue as string[]) || []);
        }
        break;
    }

    setLastAction(null);
    setCanUndo(false);
  };

  const handleSaveSize = () => {
    if (selectedComponent && selectedSize) {
      const previousValue = componentSizes[selectedComponent];
      
      // Update the size in componentSizes
      setComponentSizes(prev => ({
        ...prev,
        [selectedComponent]: selectedSize
      }));

      // Also update labeledComponents for consistency
      setLabeledComponents(prevComponents => 
        prevComponents.map(c => 
          c.name === selectedComponent ? { ...c, size: selectedSize as Component['size'] } : c
        )
      );

      // Store the last action
      setLastAction({
        type: 'size',
        component: selectedComponent,
        value: selectedSize,
        previousValue
      });
      setCanUndo(true);

      // Reset selections
      setSelectedComponent('');
      setSelectedSize('');
    }
  };

  const handleSaveFrequency = () => {
    if (selectedComponent && selectedFrequency) {
      const previousValue = componentFrequencies[selectedComponent];
      
      // Update the frequency in componentFrequencies
      setComponentFrequencies(prev => ({
        ...prev,
        [selectedComponent]: selectedFrequency
      }));

      // Also update labeledComponents for consistency
      setLabeledComponents(prevComponents => 
        prevComponents.map(c => 
          c.name === selectedComponent ? { ...c, frequency: selectedFrequency as Component['frequency'] } : c
        )
      );

      // Store the last action
      setLastAction({
        type: 'frequency',
        component: selectedComponent,
        value: selectedFrequency,
        previousValue
      });
      setCanUndo(true);

      // Reset selections
      setSelectedComponent('');
      setSelectedFrequency('');
    }
  };

  const handleSaveProximity = () => {
    if (selectedComponent && selectedTarget && selectedDistance) {
      // Add proximity for source -> target
      setComponentProximities(prev => ({
        ...prev,
        [selectedComponent]: [
          ...prev[selectedComponent],
          { target: selectedTarget, proximity: selectedDistance }
        ],
        [selectedTarget]: [
          ...prev[selectedTarget],
          { target: selectedComponent, proximity: selectedDistance }
        ]
      }));

      // Store the last action
      setLastAction({
        type: 'proximity',
        component: selectedComponent,
        target: selectedTarget,
        value: selectedDistance
      });
      setCanUndo(true);

      // Reset selections
      setSelectedTarget('');
      setSelectedDistance('');
    }
  };

  const handleSaveSpatial = () => {
    if (selectedComponent && selectedTarget && selectedSpatial) {
      const oppositeSpatial = getOppositeSpatial(selectedSpatial);

      // Add spatial relation for source -> target
      setComponentSpatialRelations(prev => ({
        ...prev,
        [selectedComponent]: [
          ...prev[selectedComponent],
          { target: selectedTarget, spatialRelation: selectedSpatial }
        ],
        [selectedTarget]: [
          ...prev[selectedTarget],
          { target: selectedComponent, spatialRelation: oppositeSpatial }
        ]
      }));

      // Store the last action
      setLastAction({
        type: 'spatial',
        component: selectedComponent,
        target: selectedTarget,
        value: selectedSpatial
      });
      setCanUndo(true);

      // Reset selections
      setSelectedTarget('');
      setSelectedSpatial('');
    }
  };

  const getNextProximityPair = () => {
    if (currentSourceIndex < allComponents.length - 1) {
      if (currentTargetIndex < allComponents.length - 1) {
        setCurrentTargetIndex(currentTargetIndex + 1);
        setSelectedTarget(allComponents[currentTargetIndex + 1].name);
      } else {
        setCurrentSourceIndex(currentSourceIndex + 1);
        setCurrentTargetIndex(currentSourceIndex + 2);
        setSelectedComponent(allComponents[currentSourceIndex + 1].name);
        setSelectedTarget(allComponents[currentSourceIndex + 2].name);
      }
    }
  };

  const getOppositeSpatial = (spatial: string): string => {
    const opposites: { [key: string]: string } = {
      'Above': 'Below',
      'Below': 'Above',
      'Left': 'Right',
      'Right': 'Left',
      'Above-Left': 'Below-Right',
      'Above-Right': 'Below-Left',
      'Below-Left': 'Above-Right',
      'Below-Right': 'Above-Left',
      'Same Place': 'Same Place'
    };
    return opposites[spatial] || spatial;
  };

  const getNextSpatialPair = () => {
    if (spatialSourceIndex < allComponents.length - 1) {
      if (spatialTargetIndex < allComponents.length - 1) {
        setSpatialTargetIndex(spatialTargetIndex + 1);
        setSelectedTarget(allComponents[spatialTargetIndex + 1].name);
      } else {
        setSpatialSourceIndex(spatialSourceIndex + 1);
        setSpatialTargetIndex(spatialSourceIndex + 2);
        setSelectedComponent(allComponents[spatialSourceIndex + 1].name);
        setSelectedTarget(allComponents[spatialSourceIndex + 2].name);
      }
    }
  };

  const getNextLandmarkComponent = () => {
    if (landmarkComponentIndex < allComponents.length - 1) {
      setLandmarkComponentIndex(landmarkComponentIndex + 1);
      setSelectedComponent(allComponents[landmarkComponentIndex + 1].name);
      setSelectedLandmark('');
    }
  };

  const handleSaveLandmark = () => {
    if (selectedComponent && selectedLandmarks.length === 3) {
      // Store the previous value for undo functionality
      const previousValue = componentLandmarks[selectedComponent] || [];

      // Update component landmarks
      setComponentLandmarks(prev => ({
        ...prev,
        [selectedComponent]: selectedLandmarks
      }));

      // Update labeled components
      setLabeledComponents(prevComponents => 
        prevComponents.map(c => 
          c.name === selectedComponent ? { ...c, landmarks: selectedLandmarks } : c
        )
      );

      // Store the last action
      setLastAction({
        type: 'landmark',
        component: selectedComponent,
        value: selectedLandmarks,
        previousValue
      });
      setCanUndo(true);

      // Reset selection
      setSelectedLandmarks([]);
    }
  };

  const addLandmark = (landmarkName: string) => {
    if (selectedLandmarks.length < 3 && !selectedLandmarks.includes(landmarkName)) {
      setSelectedLandmarks(prev => [...prev, landmarkName]);
    }
  };

  const removeLandmark = (landmarkName: string) => {
    setSelectedLandmarks(prev => prev.filter(l => l !== landmarkName));
  };

  const generateLegendJson = () => {
    const legendItems: LegendItem[] = allComponents.map((comp, index) => {
      // Get all relationships for this component
      const relationships = allComponents
        .filter(target => target.name !== comp.name)
        .map(target => {
          // Find proximity and spatial relation from our stored data
          const proximityEntry = componentProximities[comp.name]?.find(entry => entry.target === target.name);
          const spatialEntry = componentSpatialRelations[comp.name]?.find(entry => entry.target === target.name);
          
          // Check if this target is one of the landmarks for the current component
          const isLandmark = (comp.landmarks || []).includes(target.name);

          return {
            target: target.name,
            proximity: proximityEntry?.proximity || "UNKNOWN",
            significance: 0.5,
            position: spatialEntry?.spatialRelation || "UNKNOWN",
            landmark: isLandmark
          };
        });

      return {
        id: index + 1,
        text: comp.name,
        size: componentSizes[comp.name] || "UNKNOWN",
        frequency: componentFrequencies[comp.name] || "UNKNOWN",
        landmarks: (comp.landmarks || []).join(', ') || "UNKNOWN",
        relationships
      };
    });

    const jsonData = {
      brand: selectedBrand,
      model: selectedModel,
      legend_items: legendItems
    };

    // Create a blob and download link
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedBrand}_${selectedModel}_annotations.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartAnnotation = () => {
    if (selectedBrand && selectedModel) {
      // Load the components.json file for the selected model
      fetch(`/annotation-tool/Dataset/${selectedBrand}/${selectedModel}/components.json`)
        .then(response => response.json())
        .then(data => {
          // Convert the array of component names to Component objects
          const components = data.map((name: string) => ({ name }));
          setLabeledComponents(components);
          
          // Initialize size and frequency objects with empty values
          const initialSizes: Record<string, string> = {};
          const initialFrequencies: Record<string, string> = {};
          const initialLandmarks: Record<string, string[]> = {};
          const initialProximities: Record<string, ProximityEntry[]> = {};
          const initialSpatialRelations: Record<string, SpatialEntry[]> = {};
          
          components.forEach((comp: Component) => {
            initialSizes[comp.name] = '';
            initialFrequencies[comp.name] = '';
            initialLandmarks[comp.name] = [];
            initialProximities[comp.name] = [];
            initialSpatialRelations[comp.name] = [];
          });
          
          setComponentSizes(initialSizes);
          setComponentFrequencies(initialFrequencies);
          setComponentLandmarks(initialLandmarks);
          setComponentProximities(initialProximities);
          setComponentSpatialRelations(initialSpatialRelations);

          // Set the first component as selected for both stages
          if (components.length > 0) {
            setSelectedComponent(components[0].name);
          }

          // Set the current image path
          setCurrentImage(`/annotation-tool/Dataset/${selectedBrand}/${selectedModel}/interior.png`);
          
          // Move to stage 1
          setStage(1);
        })
        .catch(error => {
          console.error('Error loading components:', error);
          alert('Error loading components. Please try again.');
        });
    }
  };

  const handleBackToTilePage = () => {
    setStage(0);
    setSelectedBrand('');
    setSelectedModel('');
    setLabeledComponents([]);
    setComponentSizes({});
    setComponentFrequencies({});
    setComponentLandmarks({});
    setComponentProximities({});
    setComponentSpatialRelations({});
    setCurrentImage('');
    setSelectedComponent('');
    setSelectedSize('');
    setSelectedFrequency('');
    setSelectedLandmark('');
    setSelectedTarget('');
    setSelectedDistance('');
    setSelectedSpatial('');
    setSizeComponentIndex(0);
    setFrequencyComponentIndex(0);
    setLandmarkComponentIndex(0);
    setCurrentSourceIndex(0);
    setCurrentTargetIndex(1);
    setSpatialSourceIndex(0);
    setSpatialTargetIndex(1);
  };

  const renderTilePage = () => {
    console.log('Current state - selectedBrand:', selectedBrand);
    console.log('Current state - models:', models);
    console.log('Current state - selectedModel:', selectedModel);
    
    return (
      <TilePage>
        <SelectionContainer>
          <Title>Vehicle Component Annotation Tool</Title>
          
          <SelectContainer>
            <Label>Select Brand:</Label>
            <Select
              value={selectedBrand}
              onChange={(e) => {
                console.log('Brand selected:', e.target.value);
                setSelectedBrand(e.target.value);
              }}
            >
              <option value="">Choose a brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
          </SelectContainer>

          <SelectContainer>
            <Label>Select Model:</Label>
            <Select
              value={selectedModel}
              onChange={(e) => {
                console.log('Model selected:', e.target.value);
                setSelectedModel(e.target.value);
              }}
              disabled={!selectedBrand}
            >
              <option value="">Choose a model</option>
              {models.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </Select>
          </SelectContainer>

          <StartButton
            onClick={handleStartAnnotation}
            disabled={!selectedBrand || !selectedModel}
          >
            Start Annotation
          </StartButton>
        </SelectionContainer>
      </TilePage>
    );
  };

  const renderStage2 = () => {
    const isLastComponent = sizeComponentIndex === allComponents.length - 1;
    const allComponentsSized = Object.values(componentSizes).every(size => size !== '');

    return (
      <>
        <MainContent>
          <InstructionsSection>
            <h2>Task Instructions</h2>
            <h3>Stage 1: Categorize Component Sizes</h3>
            <ol>
              <li>For each component, determine its relative size within the dashboard.</li>
              <li>The components will be presented one by one in a fixed order.</li>
              <li>Choose the size from the dropdown for the current component.</li>
              <li>Click "Save Size" to record your selection and move to the next component.</li>
            </ol>
            <h4>Size Categories:</h4>
            <ul>
              <li>VERY_LARGE: Dominates the dashboard, major visual element</li>
              <li>LARGE: Substantial size, but not dominating</li>
              <li>MEDIUM: Average-sized component</li>
              <li>SMALL: Smaller than average component</li>
              <li>VERY_SMALL: Minimal, hard to see without focusing</li>
            </ul>
          </InstructionsSection>

          <UserInputSection>
            <h3>Size Categorization</h3>
            {renderUndoButton()}
            <div style={{ marginBottom: '20px' }}>
              <CurrentItem>
                <CurrentItemTitle>Current Component</CurrentItemTitle>
                <CurrentItemContent>{allComponents[sizeComponentIndex]?.name || 'None'}</CurrentItemContent>
              </CurrentItem>
              <h4>Select Size</h4>
              <Select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Choose a size</option>
                <option value="Very Large">Very Large</option>
                <option value="Large">Large</option>
                <option value="Medium">Medium</option>
                <option value="Small">Small</option>
                <option value="Very Small">Very Small</option>
              </Select>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button 
                  onClick={() => {
                    if (isLastComponent && allComponentsSized) {
                      setStage(2);
                      setSelectedComponent(allComponents[0].name);
                    } else {
                      handleSaveSize();
                      getNextSizeComponent();
                    }
                  }}
                  disabled={!selectedSize}
                >
                  {isLastComponent && allComponentsSized ? 'Proceed to Stage 2' : 'Save Size and Continue'}
                </Button>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4>Progress: {sizeComponentIndex + 1} of {allComponents.length} components</h4>
            </div>

            <Button 
              onClick={() => {
                setStage(2);
                setSelectedComponent(allComponents[0].name);
              }}
              style={{ backgroundColor: '#28a745', marginTop: '20px' }}
            >
              Proceed to Stage 2
            </Button>
          </UserInputSection>
        </MainContent>

        <AnnotatedList>
          <h4>Sized Components:</h4>
          <ul>
            {Object.entries(componentSizes)
              .filter(([_, size]) => size !== '')
              .map(([name, size], index) => (
                <li key={index}>{name}: {size}</li>
              ))}
          </ul>
        </AnnotatedList>
      </>
    );
  };

  const renderStage3 = () => {
    const isLastComponent = frequencyComponentIndex === allComponents.length - 1;
    const allComponentsFrequencied = Object.values(componentFrequencies).every(freq => freq !== '');

    return (
      <>
        <MainContent>
          <InstructionsSection>
            <h2>Task Instructions</h2>
            <h3>Stage 2: Annotate Component Usage Frequency</h3>
            <ol>
              <li>Consider how frequently each component is likely used by a driver.</li>
              <li>The components will be presented one by one in a fixed order.</li>
              <li>Choose the frequency from the dropdown for the current component.</li>
              <li>Click "Save Frequency" to record your selection and move to the next component.</li>
            </ol>
            <h4>Frequency Categories:</h4>
            <ul>
              <li>CONSTANT: User interacts with this almost every drive (e.g., steering wheel)</li>
              <li>FREQUENT: User interacts with this in most drives (e.g., climate controls)</li>
              <li>OCCASIONAL: User interacts with this weekly or in specific situations</li>
              <li>RARE: User interacts with this only few times a year or in special cases</li>
              <li>EMERGENCY: User only interacts with this in emergencies or problems</li>
            </ul>
          </InstructionsSection>

          <UserInputSection>
            <h3>Frequency Annotation</h3>
            {renderUndoButton()}
            <Button 
              onClick={() => {
                setStage(1);
                setSelectedComponent(allComponents[sizeComponentIndex].name);
              }}
              style={{ backgroundColor: '#6c757d', marginBottom: '20px' }}
            >
              Back to Stage 1
            </Button>

            <div style={{ marginBottom: '20px' }}>
              <CurrentItem>
                <CurrentItemTitle>Current Component</CurrentItemTitle>
                <CurrentItemContent>{allComponents[frequencyComponentIndex]?.name || 'None'}</CurrentItemContent>
              </CurrentItem>
              <h4>Select Frequency</h4>
              <Select
                value={selectedFrequency}
                onChange={(e) => setSelectedFrequency(e.target.value)}
              >
                <option value="">Choose frequency</option>
                <option value="Constant">Constant</option>
                <option value="Frequent">Frequent</option>
                <option value="Occasional">Occasional</option>
                <option value="Rare">Rare</option>
                <option value="Emergency">Emergency</option>
              </Select>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button 
                  onClick={() => {
                    if (isLastComponent && allComponentsFrequencied) {
                      setStage(3);
                      setSelectedComponent(allComponents[0].name);
                      setSelectedTarget(allComponents[1].name);
                    } else {
                      handleSaveFrequency();
                      getNextFrequencyComponent();
                    }
                  }}
                  disabled={!selectedFrequency}
                >
                  {isLastComponent && allComponentsFrequencied ? 'Proceed to Stage 3' : 'Save Frequency and Continue'}
                </Button>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4>Progress: {frequencyComponentIndex + 1} of {allComponents.length} components</h4>
            </div>

            <Button 
              onClick={() => {
                setStage(3);
                setSelectedComponent(allComponents[0].name);
                setSelectedTarget(allComponents[1].name);
              }}
              style={{ backgroundColor: '#28a745', marginTop: '20px' }}
            >
              Proceed to Stage 3
            </Button>
          </UserInputSection>
        </MainContent>

        <AnnotatedList>
          <h4>Annotated Components:</h4>
          <ul>
            {Object.entries(componentFrequencies)
              .filter(([_, freq]) => freq !== '')
              .map(([name, freq], index) => (
                <li key={index}>{name}: {freq}</li>
              ))}
          </ul>
        </AnnotatedList>
      </>
    );
  };

  const renderStage4 = () => {
    const isLastPair = currentSourceIndex === allComponents.length - 2 && 
                      currentTargetIndex === allComponents.length - 1;
    const allPairsAnnotated = Object.values(componentProximities).every(entries => 
      entries.length === allComponents.length - 1
    );

    return (
      <>
        <MainContent>
          <InstructionsSection>
            <h2>Task Instructions</h2>
            <h3>Stage 3: Identify Proximity Between Components</h3>
            <ol>
              <li>For each pair of components, determine their relative distance in the dashboard.</li>
              <li>Component pairs will be presented one by one in a fixed order.</li>
              <li>Choose the proximity level from the dropdown for the current pair.</li>
              <li>Click "Save Proximity" to record your selection and move to the next pair.</li>
              <li><strong>Note:</strong> The system will automatically handle the reverse relationship.</li>
            </ol>
            <h4>Proximity Categories:</h4>
            <ul>
              <li>ADJACENT: Directly next to each other, touching or nearly touching</li>
              <li>CLOSE: Near each other, but with some small space or other elements between</li>
              <li>MODERATE: Some distance apart, but still in the same general area</li>
              <li>FAR: Located in different areas of the dashboard</li>
              <li>VERY_FAR: At opposite ends of the dashboard</li>
            </ul>
          </InstructionsSection>

          <UserInputSection>
            <h3>Proximity Annotation</h3>
            {renderUndoButton()}
            <Button 
              onClick={() => {
                setStage(2);
                setSelectedComponent(allComponents[frequencyComponentIndex].name);
              }}
              style={{ backgroundColor: '#6c757d', marginBottom: '20px' }}
            >
              Back to Stage 2
            </Button>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '1.4em', fontWeight: 700, marginBottom: '15px' }}>
                The proximity of <span style={{ fontWeight: 800, color: '#1976d2' }}>{allComponents[currentSourceIndex]?.name || 'None'}</span> and <span style={{ fontWeight: 800, color: '#1976d2' }}>{allComponents[currentTargetIndex]?.name || 'None'}</span> is:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Select
                  value={selectedDistance}
                  onChange={(e) => setSelectedDistance(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Choose proximity</option>
                  <option value="Adjacent">Adjacent</option>
                  <option value="Close">Close</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Far">Far</option>
                  <option value="Very Far">Very Far</option>
                </Select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button 
                  onClick={() => {
                    if (isLastPair && allPairsAnnotated) {
                      setStage(4);
                      setSelectedComponent(allComponents[0].name);
                      setSelectedTarget(allComponents[1].name);
                      setSpatialSourceIndex(0);
                      setSpatialTargetIndex(1);
                    } else {
                      handleSaveProximity();
                      getNextProximityPair();
                    }
                  }}
                  disabled={!selectedDistance}
                >
                  {isLastPair && allPairsAnnotated ? 'Proceed to Stage 4' : 'Save Proximity and Continue'}
                </Button>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4>Progress: {currentSourceIndex + 1} of {allComponents.length - 1} source components</h4>
            </div>

            <Button 
              onClick={() => {
                console.log('Going to Stage 4');
                setStage(4);
                setSelectedComponent(allComponents[0].name);
                setSelectedTarget(allComponents[1].name);
                setSpatialSourceIndex(0);
                setSpatialTargetIndex(1);
              }}
              style={{ backgroundColor: '#28a745', marginTop: '20px' }}
            >
              Proceed to Stage 4
            </Button>
          </UserInputSection>
        </MainContent>

        <AnnotatedList>
          <h4>Annotated Proximities:</h4>
          <ul>
            {Object.entries(componentProximities)
              .map(([source, entries]) => 
                entries.map((entry, index) => (
                  <li key={`${source}-${entry.target}-${index}`}>
                    {source} → {entry.target} ({entry.proximity})
                  </li>
                ))
              )}
          </ul>
        </AnnotatedList>
      </>
    );
  };

  const renderStage5 = () => {
    const isLastPair = spatialSourceIndex === allComponents.length - 2 && 
                      spatialTargetIndex === allComponents.length - 1;
    const allPairsAnnotated = Object.values(componentSpatialRelations).every(entries => 
      entries.length === allComponents.length - 1
    );

    return (
      <>
        <MainContent>
          <InstructionsSection>
            <h2>Task Instructions</h2>
            <h3>Stage 4: Determine Detailed Spatial Relationships</h3>
            <ol>
              <li>For each component pair, specify the exact directional relationship from the source component's perspective.</li>
              <li>Component pairs will be presented one by one in a fixed order.</li>
              <li>Choose the spatial relationship from the dropdown for the current pair.</li>
              <li>Click "Save Spatial Relationship" to record your selection and move to the next pair.</li>
              <li><strong>Note:</strong> The system will automatically record the opposite relationship for the target component.</li>
            </ol>
            <h4>Position Categories:</h4>
            <ul>
              <li>ABOVE: Target is positioned above the Source</li>
              <li>BELOW: Target is positioned below the Source</li>
              <li>LEFT: Target is positioned to the left of the Source</li>
              <li>RIGHT: Target is positioned to the right of the Source</li>
              <li>ABOVE_LEFT: Target is positioned diagonally above and to the left of the Source</li>
              <li>ABOVE_RIGHT: Target is positioned diagonally above and to the right of the Source</li>
              <li>BELOW_LEFT: Target is positioned diagonally below and to the left of the Source</li>
              <li>BELOW_RIGHT: Target is positioned diagonally below and to the right of the Source</li>
              <li>SAME_LOCATION: Target occupies the same visual space as the Source or significantly overlaps</li>
            </ul>
          </InstructionsSection>

          <UserInputSection>
            <h3>Spatial Relationship Annotation</h3>
            {renderUndoButton()}
            <Button 
              onClick={() => {
                setStage(3);
                setSelectedComponent(allComponents[currentSourceIndex].name);
                setSelectedTarget(allComponents[currentTargetIndex].name);
              }}
              style={{ backgroundColor: '#6c757d', marginBottom: '20px' }}
            >
              Back to Stage 3
            </Button>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '1.4em', fontWeight: 700, marginBottom: '15px' }}>
                Identify spatial relations: <span style={{ fontWeight: 800, color: '#1976d2' }}>{allComponents[spatialTargetIndex]?.name || 'None'}</span> is:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Select
                  value={selectedSpatial}
                  onChange={(e) => setSelectedSpatial(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Choose spatial relationship</option>
                  <option value="Above">Above</option>
                  <option value="Below">Below</option>
                  <option value="Left">Left</option>
                  <option value="Right">Right</option>
                  <option value="Above-Left">Above-Left</option>
                  <option value="Above-Right">Above-Right</option>
                  <option value="Below-Left">Below-Left</option>
                  <option value="Below-Right">Below-Right</option>
                  <option value="Same Place">Same Place</option>
                </Select>
                <span style={{ marginLeft: '5px', fontSize: '1.4em', fontWeight: 700 }}>of <span style={{ fontWeight: 800, color: '#1976d2' }}>{allComponents[spatialSourceIndex]?.name || 'None'}</span></span>
              </div>

              <Button 
                onClick={() => {
                  if (isLastPair && allPairsAnnotated) {
                    setStage(5);
                    setSelectedComponent(allComponents[0].name);
                    setLandmarkComponentIndex(0);
                  } else {
                    handleSaveSpatial();
                    getNextSpatialPair();
                  }
                }}
                disabled={!selectedSpatial}
                style={{ marginTop: '10px' }}
              >
                {isLastPair && allPairsAnnotated ? 'Proceed to Stage 5' : 'Save Spatial Relationship and Continue'}
              </Button>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4>Progress: {spatialSourceIndex + 1} of {allComponents.length - 1} source components</h4>
            </div>

            <Button 
              onClick={() => {
                console.log('Going to Stage 5');
                setStage(5);
                setSelectedComponent(allComponents[0].name);
                setLandmarkComponentIndex(0);
              }}
              style={{ backgroundColor: '#28a745', marginTop: '20px' }}
            >
              Proceed to Stage 5
            </Button>
          </UserInputSection>
        </MainContent>

        <AnnotatedList>
          <h4>Annotated Spatial Relationships:</h4>
          <ul>
            {Object.entries(componentSpatialRelations)
              .map(([source, entries]) => 
                entries.map((entry, index) => (
                  <li key={`${source}-${entry.target}-${index}`}>
                    {source} → {entry.target} ({entry.spatialRelation})
                  </li>
                ))
              )}
          </ul>
        </AnnotatedList>
      </>
    );
  };

  const renderStage6 = () => {
    const isLastComponent = landmarkComponentIndex === allComponents.length - 1;
    const allComponentsLandmarked = Object.values(componentLandmarks).every(landmarks => landmarks.length === 3);
    const currentComponent = allComponents[landmarkComponentIndex];
    const availableLandmarks = allComponents.filter(comp => comp.name !== currentComponent?.name);

    return (
      <>
        <MainContent>
          <InstructionsSection>
            <h2>Task Instructions</h2>
            <h3>Stage 5: Landmark Selection</h3>
            <ol>
              <li>For each component, select 3 landmark components that best describe its spatial position.</li>
              <li>Landmarks are reference points that help describe where the current component is located.</li>
              <li>Choose components that are visually distinctive and can effectively describe spatial relationships.</li>
              <li>Examples: "Component A is below Landmark B, to the right of Landmark C, and above Landmark D"</li>
              <li>Click on component names to add/remove them as landmarks (exactly 3 required).</li>
            </ol>
            <h4>Landmark Selection Criteria:</h4>
            <ul>
              <li><strong>Distinctive:</strong> Choose components that are easily recognizable</li>
              <li><strong>Spatially Relevant:</strong> Components that help describe the current component's position</li>
              <li><strong>Well-Positioned:</strong> Components that provide good reference points</li>
            </ul>
          </InstructionsSection>

          <UserInputSection>
            <h3>Landmark Selection</h3>
            {renderUndoButton()}
            <Button 
              onClick={() => {
                setStage(4);
                setSelectedComponent(allComponents[spatialSourceIndex].name);
                setSelectedTarget(allComponents[spatialTargetIndex].name);
              }}
              style={{ backgroundColor: '#6c757d', marginBottom: '20px' }}
            >
              Back to Stage 4
            </Button>

            <div style={{ marginBottom: '20px' }}>
              <CurrentItem>
                <CurrentItemTitle>Current Component</CurrentItemTitle>
                <CurrentItemContent>{currentComponent?.name || 'None'}</CurrentItemContent>
              </CurrentItem>
              
              <h4>Select 3 Landmark Components ({selectedLandmarks.length}/3):</h4>
              
              <div style={{ marginBottom: '15px' }}>
                <strong>Selected Landmarks:</strong>
                {selectedLandmarks.length === 0 ? (
                  <div style={{ color: '#666', fontStyle: 'italic' }}>No landmarks selected yet</div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                    {selectedLandmarks.map((landmark, index) => (
                      <div key={landmark} style={{ 
                        backgroundColor: '#e3f2fd', 
                        padding: '5px 10px', 
                        borderRadius: '15px', 
                        border: '1px solid #2196f3',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {landmark}
                        <button 
                          onClick={() => removeLandmark(landmark)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#f44336', 
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Available Components:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                  {availableLandmarks.map((comp) => (
                    <button
                      key={comp.name}
                      onClick={() => addLandmark(comp.name)}
                      disabled={selectedLandmarks.includes(comp.name) || selectedLandmarks.length >= 3}
                      style={{
                        backgroundColor: selectedLandmarks.includes(comp.name) ? '#4caf50' : '#f5f5f5',
                        color: selectedLandmarks.includes(comp.name) ? 'white' : '#333',
                        border: '1px solid #ddd',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: selectedLandmarks.includes(comp.name) || selectedLandmarks.length >= 3 ? 'not-allowed' : 'pointer',
                        opacity: selectedLandmarks.includes(comp.name) || selectedLandmarks.length >= 3 ? 0.6 : 1
                      }}
                    >
                      {comp.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button 
                  onClick={() => {
                    if (isLastComponent && allComponentsLandmarked) {
                      generateLegendJson();
                      handleBackToTilePage();
                    } else {
                      handleSaveLandmark();
                      getNextLandmarkComponent();
                    }
                  }}
                  disabled={selectedLandmarks.length !== 3}
                >
                  {isLastComponent && allComponentsLandmarked ? 'Export and Finish' : 'Save Landmarks and Continue'}
                </Button>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4>Progress: {landmarkComponentIndex + 1} of {allComponents.length} components</h4>
            </div>

            <Button 
              onClick={generateLegendJson}
              style={{ 
                backgroundColor: '#28a745', 
                marginTop: '20px',
                width: '100%',
                padding: '15px',
                fontSize: '1.2em'
              }}
            >
              Export Current Annotations as JSON
            </Button>

            <Button 
              onClick={handleBackToTilePage}
              style={{ backgroundColor: '#28a745', marginTop: '20px' }}
            >
              Back to Home
            </Button>
          </UserInputSection>
        </MainContent>

        <AnnotatedList>
          <h4>Component Landmarks:</h4>
          {Object.entries(componentLandmarks).map(([name, landmarks]) => (
            <div key={name} style={{ marginBottom: '10px' }}>
              <h5 style={{ margin: '5px 0', color: '#333' }}>{name}:</h5>
              {landmarks.length === 0 ? (
                <div style={{ color: '#666', fontStyle: 'italic', fontSize: '0.9em' }}>No landmarks selected</div>
              ) : (
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  {landmarks.map((landmark, index) => (
                    <li key={`${name}-${landmark}-${index}`} style={{ fontSize: '0.9em' }}>{landmark}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </AnnotatedList>
      </>
    );
  };

  // Add undo button to the UI
  const renderUndoButton = () => {
    return (
      <div style={{ marginBottom: '20px' }}>
        <Button 
          onClick={handleUndo}
          disabled={!canUndo}
          style={{ backgroundColor: canUndo ? '#6c757d' : '#cccccc' }}
        >
          Undo Last Action
        </Button>
      </div>
    );
  };

  return (
    <AppContainer>
      {stage === 0 ? (
        renderTilePage()
      ) : (
        <>
          <ImageSection>
            <img src={currentImage} alt="Car Dashboard" />
          </ImageSection>
          
          <SidePanel>
            {(() => {
              console.log('Current stage:', stage);
              if (stage === 1) return renderStage2();
              if (stage === 2) return renderStage3();
              if (stage === 3) return renderStage4();
              if (stage === 4) return renderStage5();
              if (stage === 5) return renderStage6();
              return <div>Unknown stage: {stage}</div>;
            })()}
          </SidePanel>
        </>
      )}
    </AppContainer>
  );
}

export default App; 