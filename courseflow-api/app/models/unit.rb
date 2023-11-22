class Unit < ApplicationRecord
  serialize :interests, coder: JSON
  serialize :requirements, coder: JSON
end
